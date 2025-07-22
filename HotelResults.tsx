import React, { useState, useMemo } from 'react';
import type { Hotel } from '../types';
import { BedIcon, StarIcon, CheckCircleIcon, MapPinIcon, ShieldCheckIcon, ChevronUpDownIcon } from './IconComponents';
import { LordIcon } from './LordIcon';
import { useComparison } from '../context/ComparisonContext';

interface HotelResultsProps {
  hotels: Hotel[];
  isLoading: boolean;
  hotelSummary?: string | null;
  currencySymbol: string;
  t: (key: string) => string;
  onToggleFavorite: (hotel: Hotel, type: 'hotel') => void;
  isFavorite: (hotel: Hotel, type: 'hotel') => boolean;
  onBookNow: (url: string) => void;
  title?: string;
}

type SortOption = 'default' | 'price_asc' | 'price_desc' | 'rating_desc' | 'convenience_desc';

const AmenityPill: React.FC<{ amenity: string }> = ({ amenity }) => (
    <span className="text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-full">
        {amenity}
    </span>
);

const ConvenienceScore: React.FC<{ score: number, t: (key: string) => string }> = ({ score, t }) => {
    const getColor = () => {
        if (score >= 85) return 'text-green-600 dark:text-green-400';
        if (score >= 60) return 'text-yellow-500 dark:text-yellow-400';
        return 'text-red-500 dark:text-red-400';
    };
    return (
        <div className="flex items-center gap-1.5" title={`${t('convenience_score_label')}: ${score}/100`}>
            <ShieldCheckIcon className={`w-5 h-5 ${getColor()}`} />
            <span className={`font-semibold text-sm ${getColor()}`}>{score}</span>
        </div>
    );
};

const HotelAnalysisCard: React.FC<{ summary: string; t: (key: string) => string }> = ({ summary, t }) => (
  <div className="bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-500 dark:border-indigo-600 p-5 rounded-r-lg mb-6">
    <div className="flex">
      <div className="py-1 shrink-0">
        <CheckCircleIcon className="w-6 h-6 text-indigo-500 dark:text-indigo-600 mr-4"/>
      </div>
      <div>
        <p className="font-bold text-indigo-800 dark:text-indigo-300">{t('ai_hotel_analysis')}</p>
        <p className="text-md text-indigo-700 dark:text-indigo-400">{summary}</p>
      </div>
    </div>
  </div>
);

const HotelCard: React.FC<{ 
    hotel: Hotel; 
    currencySymbol: string;
    t: (key: string) => string;
    onToggleFavorite: (hotel: Hotel, type: 'hotel') => void;
    isFavorited: boolean;
    onBookNow: (url: string) => void;
}> = ({ hotel, currencySymbol, t, onToggleFavorite, isFavorited, onBookNow }) => {
    const { items, addItem, removeItem, canAddItem } = useComparison();
    const isComparing = items.some(item => item.type === 'hotel' && item.item.name === hotel.name);

    const handleToggleCompare = () => {
        if (isComparing) {
        removeItem({ type: 'hotel', item: hotel });
        } else {
        addItem({ type: 'hotel', item: hotel });
        }
    };
    
    const handleViewOnMap = () => {
        const query = encodeURIComponent(hotel.address || `${hotel.name}, ${hotel.summary || ''}`);
        const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-slate-200 dark:border-slate-800 flex flex-col h-full group">
        <div className="flex-grow">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    {hotel.summary && (
                        <span className="inline-block bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300 text-xs font-semibold mb-2 px-2.5 py-1 rounded-full">
                        {hotel.summary}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-3 ml-2">
                    {hotel.convenienceScore && <ConvenienceScore score={hotel.convenienceScore} t={t} />}
                    <button
                        onClick={() => onToggleFavorite(hotel, 'hotel')}
                        className="p-1.5 rounded-full text-slate-400 dark:text-slate-500 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                        aria-label={isFavorited ? t('remove_from_favorites') : t('add_to_favorites')}
                    >
                        <LordIcon
                            src="https://cdn.lordicon.com/ulnswmke.json"
                            trigger="click"
                            colors={isFavorited ? 'primary:#ef4444,secondary:#ef4444' : 'primary:#94a3b8,secondary:#94a3b8'}
                            style={{ width: '28px', height: '28px' }}
                        />
                    </button>
                </div>
            </div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-xl mt-1">{hotel.name}</h3>
            {hotel.address && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 truncate" title={hotel.address}>
                    {hotel.address}
                </p>
            )}
            <div className="flex items-center my-3">
            {Array.from({ length: 5 }, (_, i) => (
                <StarIcon
                key={i}
                className={`w-5 h-5 ${i < Math.round(hotel.rating) ? 'text-yellow-400' : 'text-slate-300 dark:text-slate-700'}`}
                />
            ))}
            <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">{hotel.rating.toFixed(1)} Stars</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
            {hotel.amenities.slice(0, 4).map((amenity, i) => (
                <AmenityPill key={i} amenity={amenity} />
            ))}
            </div>
        </div>
        <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-slate-200 dark:border-slate-800 pt-5">
            <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                    onClick={() => hotel.bookingUrl && onBookNow(hotel.bookingUrl)}
                    disabled={!hotel.bookingUrl}
                    className="flex-1 sm:flex-initial text-md font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-lg px-6 py-2.5 hover:opacity-90 disabled:from-slate-400 disabled:to-slate-500 dark:disabled:from-slate-600 dark:disabled:to-slate-700 disabled:cursor-not-allowed transition-all shadow-md"
                >
                    {t('book_now')}
                </button>
                <button
                    onClick={handleToggleCompare}
                    disabled={!isComparing && !canAddItem('hotel')}
                    className={`flex-1 sm:flex-initial text-md font-semibold rounded-lg px-6 py-2.5 transition-colors ${
                        isComparing
                        ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                    {isComparing ? t('comparing') : t('compare')}
                </button>
                <button
                    onClick={handleViewOnMap}
                    className="p-2.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700"
                    title={t('view_on_map')}
                >
                    <MapPinIcon className="w-5 h-5" />
                </button>
            </div>
            <div className='text-right flex-shrink-0'>
                <span className="text-2xl font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">{currencySymbol}{hotel.pricePerNight.toLocaleString()}</span>
                <span className="text-slate-600 dark:text-slate-400 text-sm">/{t('price_per_night')}</span>
            </div>
        </div>
      </div>
    );
};

const PlaceholderCard: React.FC = () => (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 animate-pulse">
      <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
      <div className="flex items-center mb-4">
        <div className="h-5 w-28 bg-slate-200 dark:bg-slate-700 rounded"></div>
      </div>
      <div className="flex gap-2 mb-6">
        <div className="h-5 w-16 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
        <div className="h-5 w-20 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
        <div className="h-5 w-14 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
      </div>
       <div className="flex justify-between items-center mt-6 pt-5 border-t border-slate-200 dark:border-slate-800">
        <div className="flex gap-2">
            <div className="h-10 w-28 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
            <div className="h-10 w-28 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
        </div>
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
    </div>
    </div>
);

export const HotelResults: React.FC<HotelResultsProps> = ({ hotels, isLoading, hotelSummary, currencySymbol, t, onToggleFavorite, isFavorite, title, onBookNow }) => {
  const [sortOrder, setSortOrder] = useState<SortOption>('default');

  const sortedHotels = useMemo(() => {
    const hotelsCopy = [...hotels];
    switch(sortOrder) {
      case 'price_asc':
        return hotelsCopy.sort((a, b) => a.pricePerNight - b.pricePerNight);
      case 'price_desc':
        return hotelsCopy.sort((a, b) => b.pricePerNight - a.pricePerNight);
      case 'rating_desc':
        return hotelsCopy.sort((a, b) => b.rating - a.rating);
       case 'convenience_desc':
        return hotelsCopy.sort((a, b) => (b.convenienceScore || 0) - (a.convenienceScore || 0));
      case 'default':
      default:
        return hotels;
    }
  }, [hotels, sortOrder]);

  const hasContent = isLoading || sortedHotels.length > 0;
  if (!hasContent) {
    return null;
  }

  return (
    <section>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-4">
          <BedIcon className="w-9 h-9 text-indigo-600 dark:text-indigo-500" />
          {title || t('hotel_options')}
        </h2>
         {hotels.length > 1 && (
            <div className="relative">
              <label htmlFor="sort-hotels" className="sr-only">{t('sort_by')}</label>
               <select
                id="sort-hotels"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as SortOption)}
                className="pl-4 pr-10 py-2.5 text-sm font-medium bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
              >
                <option value="default">{t('sort_default')}</option>
                <option value="price_asc">{t('sort_price_asc')}</option>
                <option value="price_desc">{t('sort_price_desc')}</option>
                <option value="rating_desc">{t('sort_rating_desc')}</option>
                <option value="convenience_desc">{t('sort_convenience_desc')}</option>
              </select>
              <ChevronUpDownIcon className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
        )}
      </div>
      {!isLoading && hotelSummary && <HotelAnalysisCard summary={hotelSummary} t={t} />}
      <div className="space-y-6">
        {isLoading && sortedHotels.length === 0 ? (
          [...Array(3)].map((_, i) => <PlaceholderCard key={i} />)
        ) : sortedHotels.length > 0 ? (
          sortedHotels.map((hotel) => (
            <HotelCard 
              key={hotel.name} 
              hotel={hotel} 
              currencySymbol={currencySymbol} 
              t={t}
              onToggleFavorite={onToggleFavorite}
              isFavorited={isFavorite(hotel, 'hotel')}
              onBookNow={onBookNow}
            />
          ))
        ) : (
          !isLoading && <div className="text-center py-8 px-4 bg-slate-100 dark:bg-slate-800/50 rounded-2xl">
            <p className="text-slate-600 dark:text-slate-400">{t('no_hotels_found')}</p>
            <p className="text-sm text-slate-500 dark:text-slate-500">{t('no_hotels_found_desc')}</p>
          </div>
        )}
      </div>
    </section>
  );
};