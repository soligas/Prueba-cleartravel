import React, { useState, useMemo } from 'react';
import type { Flight } from '../types';
import { PlaneIcon, ShieldCheckIcon, ChevronUpDownIcon } from './IconComponents';
import { LordIcon } from './LordIcon';
import { useComparison } from '../context/ComparisonContext';

interface FlightResultsProps {
  flights: Flight[];
  isLoading: boolean;
  currencySymbol: string;
  t: (key: string) => string;
  onToggleFavorite: (flight: Flight, type: 'flight') => void;
  isFavorite: (flight: Flight, type: 'flight') => boolean;
  onBookNow: (url: string) => void;
  title?: string;
}

type SortOption = 'default' | 'price_asc' | 'price_desc' | 'convenience_desc';

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


const FlightCard: React.FC<{ 
  flight: Flight; 
  currencySymbol: string; 
  t: (key: string) => string;
  onToggleFavorite: (flight: Flight, type: 'flight') => void;
  isFavorited: boolean;
  onBookNow: (url: string) => void;
}> = ({ flight, currencySymbol, t, onToggleFavorite, isFavorited, onBookNow }) => {
  const { items, addItem, removeItem, canAddItem } = useComparison();
  const isComparing = items.some(item => item.type === 'flight' && item.item.flightNumber === flight.flightNumber);

  const handleToggleCompare = () => {
    if (isComparing) {
      removeItem({ type: 'flight', item: flight });
    } else {
      addItem({ type: 'flight', item: flight });
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-slate-200 dark:border-slate-800 flex flex-col h-full group">
      <div className="flex justify-between items-start mb-4">
        <div>
            <span className="font-bold text-slate-800 dark:text-slate-200 text-lg">{flight.airline}</span>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full ml-2">{flight.flightNumber}</span>
        </div>
        <div className="flex items-center gap-4">
             {flight.convenienceScore && <ConvenienceScore score={flight.convenienceScore} t={t} />}
            <button
              onClick={() => onToggleFavorite(flight, 'flight')}
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
      <div className="flex-grow flex items-center justify-between text-slate-800 dark:text-slate-200 my-4">
        <div className="text-center flex-1 min-w-0">
          <p className="font-extrabold text-4xl truncate text-slate-800 dark:text-slate-100" title={flight.origin}>{flight.origin}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{formatTime(flight.departureTime)}</p>
        </div>
        <div className="flex-grow flex items-center justify-center text-slate-400 dark:text-slate-600 mx-2 sm:mx-4">
            <div className="w-full border-b-2 border-slate-200 dark:border-slate-700 border-dashed"></div>
            <PlaneIcon className="w-8 h-8 shrink-0 mx-2 -rotate-12 group-hover:text-indigo-500 transition-colors" />
            <div className="w-full border-b-2 border-slate-200 dark:border-slate-700 border-dashed"></div>
        </div>
        <div className="text-center flex-1 min-w-0">
          <p className="font-extrabold text-4xl truncate text-slate-800 dark:text-slate-100" title={flight.destination}>{flight.destination}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{formatTime(flight.arrivalTime)}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-slate-200 dark:border-slate-800 pt-5">
        <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
                onClick={() => flight.bookingUrl && onBookNow(flight.bookingUrl)}
                disabled={!flight.bookingUrl}
                className="flex-1 sm:flex-initial text-md font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-lg px-6 py-2.5 hover:opacity-90 disabled:from-slate-400 disabled:to-slate-500 dark:disabled:from-slate-600 dark:disabled:to-slate-700 disabled:cursor-not-allowed transition-all shadow-md"
            >
                {t('book_now')}
            </button>
             <button
              onClick={handleToggleCompare}
              disabled={!isComparing && !canAddItem('flight')}
              className={`flex-1 sm:flex-initial text-md font-semibold rounded-lg px-6 py-2.5 transition-colors ${
                isComparing
                  ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isComparing ? t('comparing') : t('compare')}
            </button>
        </div>
        <span className="text-3xl font-bold text-slate-800 dark:text-slate-200">{currencySymbol}{flight.price.toLocaleString()}</span>
      </div>
    </div>
  );
};

const PlaceholderCard: React.FC = () => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 animate-pulse">
    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-5"></div>
    <div className="flex justify-between items-center my-4">
      <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
      <div className="flex-grow flex items-center justify-center text-slate-400 mx-4">
        <div className="w-full h-px bg-slate-200 dark:bg-slate-700"></div>
      </div>
      <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
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


export const FlightResults: React.FC<FlightResultsProps> = ({ flights, isLoading, currencySymbol, t, onToggleFavorite, isFavorite, title, onBookNow }) => {
  const [sortOrder, setSortOrder] = useState<SortOption>('default');
  
  const sortedFlights = useMemo(() => {
    const flightsCopy = [...flights];
    switch (sortOrder) {
      case 'price_asc':
        return flightsCopy.sort((a, b) => a.price - b.price);
      case 'price_desc':
        return flightsCopy.sort((a, b) => b.price - a.price);
      case 'convenience_desc':
        return flightsCopy.sort((a, b) => (b.convenienceScore || 0) - (a.convenienceScore || 0));
      case 'default':
      default:
        return flights;
    }
  }, [flights, sortOrder]);

  const hasContent = isLoading || sortedFlights.length > 0;
  if (!hasContent) {
    return null;
  }
  
  return (
    <section>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-4">
          <PlaneIcon className="w-9 h-9 text-indigo-600 dark:text-indigo-500" />
          {title || t('flight_options')}
        </h2>
        {flights.length > 1 && (
            <div className="relative">
              <label htmlFor="sort-flights" className="sr-only">{t('sort_by')}</label>
               <select
                id="sort-flights"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as SortOption)}
                className="pl-4 pr-10 py-2.5 text-sm font-medium bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
              >
                <option value="default">{t('sort_default')}</option>
                <option value="price_asc">{t('sort_price_asc')}</option>
                <option value="price_desc">{t('sort_price_desc')}</option>
                <option value="convenience_desc">{t('sort_convenience_desc')}</option>
              </select>
              <ChevronUpDownIcon className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
        )}
      </div>
      <div className="space-y-6">
        {isLoading && sortedFlights.length === 0 ? (
          [...Array(3)].map((_, i) => <PlaceholderCard key={i} />)
        ) : sortedFlights.length > 0 ? (
          sortedFlights.map((flight) => (
            <FlightCard 
              key={`${flight.flightNumber}-${flight.departureTime}`} 
              flight={flight} 
              currencySymbol={currencySymbol} 
              t={t} 
              onToggleFavorite={onToggleFavorite}
              isFavorited={isFavorite(flight, 'flight')}
              onBookNow={onBookNow}
            />
          ))
        ) : (
          !isLoading && <div className="text-center py-8 px-4 bg-slate-100 dark:bg-slate-800/50 rounded-2xl">
            <p className="text-slate-600 dark:text-slate-400">{t('no_flights_found')}</p>
            <p className="text-sm text-slate-500 dark:text-slate-500">{t('no_flights_found_desc')}</p>
          </div>
        )}
      </div>
    </section>
  );
};