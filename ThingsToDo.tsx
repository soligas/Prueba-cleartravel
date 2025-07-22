import React from 'react';
import type { ThingToDo } from '../types';
import { MapPinIcon, ArrowTopRightOnSquareIcon } from './IconComponents';

interface ThingsToDoProps {
  things: ThingToDo[];
  isLoading: boolean;
  t: (key: string) => string;
}

const ThingToDoCard: React.FC<{ thing: ThingToDo; t: (key: string) => string; }> = ({ thing, t }) => {
  const handleViewOnMap = () => {
    const query = encodeURIComponent(`${thing.name}, ${thing.location}`);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start gap-5">
      <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/50 rounded-lg text-indigo-600 dark:text-indigo-400">
        <MapPinIcon className="w-7 h-7" />
      </div>
      <div className="flex-grow">
        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">{thing.name}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{thing.location}</p>
        <p className="text-slate-600 dark:text-slate-300 mt-3">{thing.description}</p>
      </div>
       <button
          onClick={handleViewOnMap}
          className="flex-shrink-0 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1.5 p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/50 transition-colors"
      >
          {t('view_on_map')} <ArrowTopRightOnSquareIcon className="w-4 h-4" />
      </button>
    </div>
  );
};


const PlaceholderCard: React.FC = () => (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 animate-pulse flex items-start gap-5">
      <div className="w-14 h-14 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
      <div className="flex-grow">
        <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full mb-3"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
      </div>
    </div>
);


export const ThingsToDo: React.FC<ThingsToDoProps> = ({ things, isLoading, t }) => {
  const hasContent = isLoading || things.length > 0;
  if (!hasContent) {
    return null;
  }
  
  return (
     <section>
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-4 mb-6">
        <MapPinIcon className="w-9 h-9 text-indigo-600 dark:text-indigo-500" />
        {t('things_to_do')}
      </h2>
      <div className="space-y-6">
        {isLoading && things.length === 0 ? (
          [...Array(3)].map((_, i) => <PlaceholderCard key={i} />)
        ) : things.length > 0 ? (
          things.map((thing, index) => (
            <ThingToDoCard key={index} thing={thing} t={t} />
          ))
        ) : (
          <div className="text-center py-8 px-4 bg-slate-100 dark:bg-slate-800/50 rounded-2xl">
            <p className="text-slate-600 dark:text-slate-400">{t('no_things_to_do_found')}</p>
            <p className="text-sm text-slate-500 dark:text-slate-500">{t('no_things_to_do_found_desc')}</p>
          </div>
        )}
      </div>
    </section>
  );
};