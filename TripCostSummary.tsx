import React from 'react';
import type { TripCostSummary as TripCostSummaryType } from '../types';
import { CurrencyDollarIcon } from './IconComponents';

interface TripCostSummaryProps {
  summary: TripCostSummaryType;
  flightCost: number;
  hotelCost: number;
  currencySymbol: string;
  t: (key: string) => string;
}

export const TripCostSummary: React.FC<TripCostSummaryProps> = ({ summary, flightCost, hotelCost, currencySymbol, t }) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-3">
        <CurrencyDollarIcon className="w-7 h-7 text-green-600 dark:text-green-500" />
        {t('trip_cost_summary_title')}
      </h2>
      
      {/* Breakdown */}
      <div className="space-y-3">
        <div className="flex justify-between items-baseline">
          <span className="text-slate-600 dark:text-slate-400">{t('flights_total')}</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">{currencySymbol}{flightCost.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="text-slate-600 dark:text-slate-400">{t('hotels_total')}</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">{currencySymbol}{hotelCost.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="text-slate-600 dark:text-slate-400">{t('food_total')}</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">{currencySymbol}{summary.dailyFoodEstimate.toLocaleString()} / day</span>
        </div>
        <div className="border-t border-slate-200 dark:border-slate-700 my-3"></div>
        <div className="flex justify-between items-center text-lg">
          <span className="font-bold text-slate-800 dark:text-slate-100">{t('total')}</span>
          <span className="font-bold text-green-600 dark:text-green-500 text-3xl">{currencySymbol}{summary.totalTripEstimate.toLocaleString()}</span>
        </div>
      </div>

      {/* AI Summary */}
      <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg mt-5 border border-slate-200 dark:border-slate-700/50">
        <p className="text-sm text-slate-600 dark:text-slate-300 italic">"{summary.summary}"</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 text-right mt-2">- {t('ai_travel_planner')}</p>
      </div>
    </div>
  );
};