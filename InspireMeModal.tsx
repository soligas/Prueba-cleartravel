import React, { useState } from 'react';
import { XMarkIcon, LightbulbIcon, SparklesIcon } from './IconComponents';

interface InspireMeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (prefs: { tripType: string; region: string; budget: string }) => void;
  isGenerating: boolean;
  t: (key: string) => string;
}

const tripTypes = ['Beach', 'City Break', 'Adventure', 'Culture', 'Relaxing', 'Foodie'];
const regions = ['Anywhere', 'Europe', 'Asia', 'North America', 'South America', 'Africa', 'Oceania'];
const budgets = [
    { value: '$', label: 'Budget-Friendly' },
    { value: '$$', label: 'Mid-Range' },
    { value: '$$$', label: 'Luxury' }
];

export const InspireMeModal: React.FC<InspireMeModalProps> = ({ isOpen, onClose, onGenerate, isGenerating, t }) => {
  const [selectedTripType, setSelectedTripType] = useState('Beach');
  const [selectedRegion, setSelectedRegion] = useState('Anywhere');
  const [selectedBudget, setSelectedBudget] = useState('$$');

  const handleSubmit = () => {
    onGenerate({
      tripType: selectedTripType,
      region: selectedRegion,
      budget: selectedBudget,
    });
  };
  
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="inspire-modal-title"
    >
      <div
        className="bg-slate-50 dark:bg-slate-900 rounded-xl shadow-2xl w-[95vw] max-w-lg flex flex-col transform animate-scale-in border border-slate-200 dark:border-slate-700 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          <h2 id="inspire-modal-title" className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <LightbulbIcon className="w-6 h-6 text-indigo-500"/>
            {t('inspire_me_title')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
            aria-label={t('close_modal')}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </header>

        <div className="p-6 space-y-6">
          {/* Trip Type */}
          <div>
            <label className="block text-md font-medium text-slate-700 dark:text-slate-300 mb-2">{t('inspire_trip_type')}</label>
            <div className="flex flex-wrap gap-2">
              {tripTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedTripType(type)}
                  className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors border ${
                    selectedTripType === type
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-700 border-slate-300 dark:border-slate-700'
                  }`}
                >
                  {t(`inspire_type_${type.toLowerCase().replace(' ', '_')}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Region and Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="region-select" className="block text-md font-medium text-slate-700 dark:text-slate-300 mb-2">{t('inspire_region')}</label>
              <select
                id="region-select"
                value={selectedRegion}
                onChange={e => setSelectedRegion(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
              >
                {regions.map(region => <option key={region} value={region}>{t(`inspire_region_${region.toLowerCase().replace(' ', '_')}`)}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="budget-select" className="block text-md font-medium text-slate-700 dark:text-slate-300 mb-2">{t('inspire_budget')}</label>
              <select
                id="budget-select"
                value={selectedBudget}
                onChange={e => setSelectedBudget(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
              >
                {budgets.map(budget => <option key={budget.value} value={budget.value}>{t(`inspire_budget_${budget.label.toLowerCase().replace('-', '_')}`)} ({budget.value})</option>)}
              </select>
            </div>
          </div>
        </div>

        <footer className="p-4 bg-slate-100 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={handleSubmit}
            disabled={isGenerating}
            className="w-full flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-purple-800 transition-all duration-300 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                {t('generating_idea')}
              </>
            ) : (
                <>
                    <SparklesIcon className="w-5 h-5 mr-2" />
                    {t('generate_idea_button')}
                </>
            )}
          </button>
        </footer>
      </div>
    </div>
  );
};