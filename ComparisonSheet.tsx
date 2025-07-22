import React from 'react';
import { useComparison } from '../context/ComparisonContext';
import { Flight, Hotel, AirbnbListing } from '../types';
import { XMarkIcon, ScaleIcon, StarIcon } from './IconComponents';

interface ComparisonSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onBookNow: (url: string) => void;
  currencySymbol: string;
  t: (key: string) => string;
}

const formatTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return dateString;
    }
};

const ComparisonHeader: React.FC<{
  name: string;
  subtext?: string;
  onRemove: () => void;
  onBookNow: () => void;
  canBook: boolean;
  t: (key: string) => string;
}> = ({ name, subtext, onRemove, onBookNow, canBook, t }) => {
  return (
    <div className="p-4 bg-slate-100/80 dark:bg-slate-800/80 rounded-t-lg relative h-full flex flex-col">
      <div className="flex-grow">
        <button onClick={onRemove} className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
          <XMarkIcon className="w-4 h-4" />
        </button>
        <p className="font-bold text-lg text-slate-800 dark:text-slate-200 truncate pr-6" title={name}>{name}</p>
        {subtext && <p className="text-sm text-slate-500 dark:text-slate-400 truncate" title={subtext}>{subtext}</p>}
      </div>
       <button
            onClick={onBookNow}
            disabled={!canBook}
            className="w-full mt-3 text-sm font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-md px-3 py-2 hover:opacity-90 disabled:from-slate-400 disabled:to-slate-500 dark:disabled:from-slate-600 dark:disabled:to-slate-700 disabled:cursor-not-allowed transition-all"
        >
            {t('book_now')}
        </button>
    </div>
  );
};


const AttributeRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <tr className="border-b border-slate-200 dark:border-slate-800">
    <th scope="row" className="py-4 px-4 text-sm font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap text-left sticky left-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">{label}</th>
    {children}
  </tr>
);

const AttributeCell: React.FC<{ children: React.ReactNode, highlight?: boolean }> = ({ children, highlight }) => (
  <td className={`py-4 px-4 text-sm text-center ${highlight ? 'font-bold text-indigo-600 dark:text-indigo-400 text-base' : 'text-slate-800 dark:text-slate-200'}`}>
    {children}
  </td>
);

export const ComparisonSheet: React.FC<ComparisonSheetProps> = ({ isOpen, onClose, onBookNow, currencySymbol, t }) => {
  const { items, removeItem } = useComparison();

  if (!isOpen) return null;

  const type = items.length > 0 ? items[0].type : null;

  const renderContent = () => {
    if (items.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <ScaleIcon className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
          <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200">{t('comparison_title')}</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2">{t('comparison_prompt')}</p>
        </div>
      );
    }
    
    const tableHeader = (
        <thead className="sticky top-[65px] bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm z-10">
            <tr>
                <th className="py-3 px-4 text-sm font-semibold text-left text-slate-600 dark:text-slate-400 w-36 md:w-48 sticky left-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm z-20">Feature</th>
                 {items.map((i) => (
                    <th key={JSON.stringify(i.item)} className="w-1/3 p-1 align-bottom">
                         {type === 'flight' && (
                            <ComparisonHeader
                                name={(i.item as Flight).airline}
                                subtext={(i.item as Flight).flightNumber}
                                onRemove={() => removeItem(i)}
                                onBookNow={() => (i.item as Flight).bookingUrl && onBookNow((i.item as Flight).bookingUrl!)}
                                canBook={!!(i.item as Flight).bookingUrl}
                                t={t}
                            />
                        )}
                        {type === 'hotel' && (
                             <ComparisonHeader
                                name={(i.item as Hotel).name}
                                subtext={(i.item as Hotel).summary}
                                onRemove={() => removeItem(i)}
                                onBookNow={() => (i.item as Hotel).bookingUrl && onBookNow((i.item as Hotel).bookingUrl!)}
                                canBook={!!(i.item as Hotel).bookingUrl}
                                t={t}
                            />
                        )}
                         {type === 'airbnb' && (
                            <ComparisonHeader
                                name={(i.item as AirbnbListing).title}
                                subtext={(i.item as AirbnbListing).type}
                                onRemove={() => removeItem(i)}
                                onBookNow={() => (i.item as AirbnbListing).bookingUrl && onBookNow((i.item as AirbnbListing).bookingUrl!)}
                                canBook={!!(i.item as AirbnbListing).bookingUrl}
                                t={t}
                            />
                        )}
                    </th>
                ))}
            </tr>
        </thead>
    );

    if (type === 'flight') {
        const flightItems = items.map(i => i.item as Flight);
        return (
            <table className="w-full border-separate" style={{ borderSpacing: 0 }}>
                {tableHeader}
                <tbody>
                    <AttributeRow label={t('price')}>
                        {flightItems.map(f => <AttributeCell key={f.flightNumber} highlight>{currencySymbol}{f.price.toLocaleString()}</AttributeCell>)}
                    </AttributeRow>
                     <AttributeRow label={t('convenience_score_label')}>
                        {flightItems.map(f => <AttributeCell key={f.flightNumber}>{f.convenienceScore || 'N/A'}/100</AttributeCell>)}
                    </AttributeRow>
                    <AttributeRow label={t('origin')}>
                        {flightItems.map(f => <AttributeCell key={f.flightNumber}>{f.origin}</AttributeCell>)}
                    </AttributeRow>
                    <AttributeRow label={t('destination')}>
                        {flightItems.map(f => <AttributeCell key={f.flightNumber}>{f.destination}</AttributeCell>)}
                    </AttributeRow>
                    <AttributeRow label={t('departure')}>
                        {flightItems.map(f => <AttributeCell key={f.flightNumber}>{formatTime(f.departureTime)}</AttributeCell>)}
                    </AttributeRow>
                    <AttributeRow label={t('arrival')}>
                        {flightItems.map(f => <AttributeCell key={f.flightNumber}>{formatTime(f.arrivalTime)}</AttributeCell>)}
                    </AttributeRow>
                </tbody>
            </table>
        );
    }

    if (type === 'hotel') {
        const hotelItems = items.map(i => i.item as Hotel);
        return (
            <table className="w-full border-separate" style={{ borderSpacing: 0 }}>
                 {tableHeader}
                 <tbody>
                    <AttributeRow label={t('price_per_night')}>
                        {hotelItems.map(h => <AttributeCell key={h.name} highlight>{currencySymbol}{h.pricePerNight.toLocaleString()}</AttributeCell>)}
                    </AttributeRow>
                     <AttributeRow label={t('convenience_score_label')}>
                        {hotelItems.map(h => <AttributeCell key={h.name}>{h.convenienceScore || 'N/A'}/100</AttributeCell>)}
                    </AttributeRow>
                    <AttributeRow label={t('rating')}>
                        {hotelItems.map(h => <AttributeCell key={h.name}><div className="flex items-center justify-center">{h.rating.toFixed(1)} <StarIcon className="w-4 h-4 ml-1 text-yellow-400"/></div></AttributeCell>)}
                    </AttributeRow>
                    <AttributeRow label={t('amenities')}>
                        {hotelItems.map(h => <AttributeCell key={h.name}><div className="text-xs text-left">{h.amenities.join(', ')}</div></AttributeCell>)}
                    </AttributeRow>
                </tbody>
            </table>
        );
    }
    
    if (type === 'airbnb') {
        const airbnbItems = items.map(i => i.item as AirbnbListing);
        return (
            <table className="w-full border-separate" style={{ borderSpacing: 0 }}>
                {tableHeader}
                <tbody>
                    <AttributeRow label={t('price_per_night')}>
                        {airbnbItems.map(a => <AttributeCell key={a.title} highlight>{currencySymbol}{a.pricePerNight.toLocaleString()}</AttributeCell>)}
                    </AttributeRow>
                    <AttributeRow label={t('rating')}>
                        {airbnbItems.map(a => <AttributeCell key={a.title}><div className="flex items-center justify-center">{a.rating.toFixed(1)} <StarIcon className="w-4 h-4 ml-1 text-yellow-400"/></div></AttributeCell>)}
                    </AttributeRow>
                     <AttributeRow label={t('guests')}>
                        {airbnbItems.map(a => <AttributeCell key={a.title}>{a.guests}</AttributeCell>)}
                    </AttributeRow>
                    <AttributeRow label={t('property_type')}>
                        {airbnbItems.map(a => <AttributeCell key={a.title}>{a.type}</AttributeCell>)}
                    </AttributeRow>
                    <AttributeRow label={t('superhost')}>
                        {airbnbItems.map(a => <AttributeCell key={a.title}>{a.isSuperhost ? t('yes') : t('no')}</AttributeCell>)}
                    </AttributeRow>
                </tbody>
            </table>
        );
    }

    return null;
  };

  return (
    <div 
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${isOpen ? 'bg-black/40 backdrop-blur-sm' : 'bg-transparent pointer-events-none'}`}
        onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`fixed top-0 right-0 bottom-0 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl shadow-2xl transition-transform duration-500 ease-in-out w-full max-w-4xl border-l border-slate-200 dark:border-slate-800 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="comparison-title"
      >
        <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm z-20 h-[65px]">
          <h2 id="comparison-title" className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <ScaleIcon className="w-5 h-5"/> {t('comparison_title')}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </header>
        <div className="overflow-auto h-[calc(100vh-65px)]">
            <div className="p-1 sm:p-4">
                {renderContent()}
            </div>
        </div>
      </div>
    </div>
  );
};