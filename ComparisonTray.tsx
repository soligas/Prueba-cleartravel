import React from 'react';
import { useComparison } from '../context/ComparisonContext';
import { ScaleIcon, XCircleIcon } from './IconComponents';

interface ComparisonTrayProps {
  onOpen: () => void;
  t: (key: string) => string;
}

export const ComparisonTray: React.FC<ComparisonTrayProps> = ({ onOpen, t }) => {
  const { items, clearItems, error } = useComparison();

  if (items.length === 0) {
    return null;
  }

  const itemType = items[0]?.type === 'flight' ? t('flights_total') : t('saved_hotels');
  const errorMessage = error ? t(error) : null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-md px-4">
      <div className={`
        flex items-center justify-between gap-4 
        bg-white/80 dark:bg-slate-900/80 backdrop-blur-md 
        rounded-xl shadow-2xl p-3 
        border ${errorMessage ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'}
        transform transition-all duration-300 animate-slide-up
      `}>
        <div className="flex-grow">
          {errorMessage ? (
            <p className="text-sm font-semibold text-red-600 dark:text-red-400">{errorMessage}</p>
          ) : (
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              {t('comparing')} {items.length} {itemType.toLowerCase()}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
           <button
            onClick={clearItems}
            className="flex items-center gap-2 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold py-2 px-3 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-offset-slate-900 transition-colors"
            aria-label={t('clear_comparison')}
           >
            <XCircleIcon className="w-5 h-5" />
            <span className="hidden sm:inline">{t('clear_comparison')}</span>
          </button>
          <button
            onClick={onOpen}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold py-2 px-3 rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-900 transition-colors disabled:from-slate-400 disabled:to-slate-500 dark:disabled:bg-slate-600 dark:disabled:text-slate-400 disabled:cursor-not-allowed"
            aria-label={t('compare_items')}
            disabled={items.length < 2 || !!errorMessage}
          >
            <ScaleIcon className="w-5 h-5" />
            <span className="hidden sm:inline">{t('compare_items')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};