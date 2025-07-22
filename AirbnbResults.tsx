import React, { useState, useMemo } from 'react';
import type { AirbnbListing } from '../types';
import { StarIcon, HomeModernIcon, UserGroupIcon, SparklesIcon, ChevronUpDownIcon } from './IconComponents';
import { LordIcon } from './LordIcon';
import { useComparison } from '../context/ComparisonContext';

interface AirbnbResultsProps {
  airbnbs: AirbnbListing[];
  isLoading: boolean;
  currencySymbol: string;
  t: (key: string) => string;
  onToggleFavorite: (airbnb: AirbnbListing, type: 'airbnb') => void;
  isFavorite: (airbnb: AirbnbListing, type: 'airbnb') => boolean;
  onBookNow: (url: string) => void;
  title?: string;
}

type SortOption = 'default' | 'price_asc' | 'price_desc' | 'rating_desc';

const AirbnbCard: React.FC<{ 
  airbnb: AirbnbListing; 
  currencySymbol: string; 
  t: (key: string) => string;
  onToggleFavorite: (airbnb: AirbnbListing, type: 'airbnb') => void;
  isFavorited: boolean;
  onBookNow: (url: string) => void;
}> = ({ airbnb, currencySymbol, t, onToggleFavorite, isFavorited, onBookNow }) => {
  const { items, addItem, removeItem, canAddItem } = useComparison();
  const isComparing = items.some(item => item.type === 'airbnb' && item.item.title === airbnb.title);

  const handleToggleCompare = () => {
    if (isComparing) {
      removeItem({ type: 'airbnb', item: airbnb });
    } else {
      addItem({ type: 'airbnb', item: airbnb });
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-slate-200 dark:border-slate-800 flex flex-col h-full group overflow-hidden">
      <div className="relative">
        <img src={airbnb.photoUrl} alt={airbnb.title} className="w-full h-52 object-cover" />
        <button
          onClick={() => onToggleFavorite(airbnb, 'airbnb')}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white transition-colors"
          aria-label={isFavorited ? t('remove_from_favorites') : t('add_to_favorites')}
        >
          <LordIcon
              src="https://cdn.lordicon.com/ulnswmke.json"
              trigger="click"
              colors={isFavorited ? 'primary:#ef4444,secondary:#ef4444' : 'primary:#ffffff,secondary:#ffffff'}
              style={{ width: '28px', height: '28px' }}
          />
        </button>
        {airbnb.isSuperhost && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
            <SparklesIcon className="w-4 h-4" />
            <span>{t('superhost')}</span>
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex-grow">
          <p className="text-sm text-slate-500 dark:text-slate-400">{airbnb.type}</p>
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg mt-1 truncate" title={airbnb.title}>{airbnb.title}</h3>
          <div className="flex items-center justify-between mt-2 text-sm">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <UserGroupIcon className="w-5 h-5"/>
                <span>{airbnb.guests} {t('guests')}</span>
            </div>
            <div className="flex items-center gap-1">
              <StarIcon className="w-5 h-5 text-yellow-400" />
              <span className="font-bold text-base">{airbnb.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-slate-200 dark:border-slate-800 pt-5">
            <div className="flex items-center gap-3 w-full sm:w-auto">
                 <button
                    onClick={() => airbnb.bookingUrl && onBookNow(airbnb.bookingUrl)}
                    disabled={!airbnb.bookingUrl}
                    className="flex-1 sm:flex-initial text-md font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-lg px-6 py-2.5 hover:opacity-90 disabled:from-slate-400 disabled:to-slate-500 dark:disabled:from-slate-600 dark:disabled:to-slate-700 disabled:cursor-not-allowed transition-all shadow-md"
                >
                    {t('book_now')}
                </button>
                <button
                    onClick={handleToggleCompare}
                    disabled={!isComparing && !canAddItem('airbnb')}
                    className={`flex-1 sm:flex-initial text-md font-semibold rounded-lg px-6 py-2.5 transition-colors ${
                        isComparing
                        ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                    {isComparing ? t('comparing') : t('compare')}
                </button>
            </div>
            <div className='text-right'>
                <span className="text-2xl font-bold text-slate-800 dark:text-slate-200">{currencySymbol}{airbnb.pricePerNight.toLocaleString()}</span>
                <span className="text-slate-600 dark:text-slate-400 text-sm"> {t('price_per_night')}</span>
            </div>
        </div>
      </div>
    </div>
  );
};

const PlaceholderCard: React.FC = () => (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 animate-pulse overflow-hidden">
        <div className="bg-slate-200 dark:bg-slate-700 h-52 w-full"></div>
        <div className="p-5">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-2"></div>
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
            <div className="flex justify-between">
                <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
                <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
            </div>
            <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <div className="flex gap-2">
                    <div className="h-10 w-28 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                    <div className="h-10 w-28 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                </div>
                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
            </div>
        </div>
    </div>
);

export const AirbnbResults: React.FC<AirbnbResultsProps> = ({ airbnbs, isLoading, currencySymbol, t, onToggleFavorite, isFavorite, title, onBookNow }) => {
    const [sortOrder, setSortOrder] = useState<SortOption>('default');

    const sortedAirbnbs = useMemo(() => {
        const airbnbsCopy = [...airbnbs];
        switch (sortOrder) {
            case 'price_asc':
                return airbnbsCopy.sort((a, b) => a.pricePerNight - b.pricePerNight);
            case 'price_desc':
                return airbnbsCopy.sort((a, b) => b.pricePerNight - a.pricePerNight);
            case 'rating_desc':
                return airbnbsCopy.sort((a, b) => b.rating - a.rating);
            case 'default':
            default:
                return airbnbs;
        }
    }, [airbnbs, sortOrder]);

    const hasContent = isLoading || sortedAirbnbs.length > 0;
    if (!hasContent) {
        return null;
    }
    
    return (
        <section>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-4">
                    <HomeModernIcon className="w-9 h-9 text-indigo-600 dark:text-indigo-500" />
                    {title || t('airbnb_options')}
                </h2>
                {airbnbs.length > 1 && (
                    <div className="relative">
                        <label htmlFor="sort-airbnbs" className="sr-only">{t('sort_by')}</label>
                        <select
                            id="sort-airbnbs"
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value as SortOption)}
                            className="pl-4 pr-10 py-2.5 text-sm font-medium bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
                        >
                            <option value="default">{t('sort_default')}</option>
                            <option value="price_asc">{t('sort_price_asc')}</option>
                            <option value="price_desc">{t('sort_price_desc')}</option>
                            <option value="rating_desc">{t('sort_rating_desc')}</option>
                        </select>
                        <ChevronUpDownIcon className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                )}
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isLoading && sortedAirbnbs.length === 0 ? (
                    [...Array(2)].map((_, i) => <PlaceholderCard key={i} />)
                ) : sortedAirbnbs.length > 0 ? (
                    sortedAirbnbs.map((airbnb) => (
                        <AirbnbCard
                            key={airbnb.title}
                            airbnb={airbnb}
                            currencySymbol={currencySymbol}
                            t={t}
                            onToggleFavorite={onToggleFavorite}
                            isFavorited={isFavorite(airbnb, 'airbnb')}
                            onBookNow={onBookNow}
                        />
                    ))
                ) : (
                    !isLoading && <div className="text-center py-8 px-4 bg-slate-100 dark:bg-slate-800/50 rounded-2xl md:col-span-2">
                        <p className="text-slate-600 dark:text-slate-400">{t('no_airbnbs_found')}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-500">{t('no_airbnbs_found_desc')}</p>
                    </div>
                )}
            </div>
        </section>
    );
};