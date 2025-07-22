import React from 'react';
import { LordIcon } from './LordIcon';

interface SearchFormProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  hasSearched: boolean;
  onClear: () => void;
  t: (key: string) => string;
  query: string;
  setQuery: (query: string) => void;
}

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading, hasSearched, onClear, t, query, setQuery }) => {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };
  
  const handleClear = () => {
    setQuery('');
    onClear();
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800">
      <form onSubmit={handleSubmit}>
        <label htmlFor="search-query" className="block text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
          {t('tell_us_plans')}
        </label>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            id="search-query"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('search_placeholder')}
            className="w-full px-5 py-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out text-lg shadow-sm"
            disabled={isLoading}
          />
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-grow flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold py-4 px-8 rounded-xl hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-purple-800 transition-all duration-300 disabled:from-slate-400 disabled:to-slate-500 dark:disabled:from-slate-600 dark:disabled:to-slate-700 disabled:cursor-not-allowed text-lg shadow-md"
              disabled={isLoading || !query}
            >
              {isLoading ? (
                  <LordIcon
                      src="https://cdn.lordicon.com/lqxfrxad.json"
                      trigger="loop"
                      colors="primary:#ffffff,secondary:#ffffff"
                      style={{ width: '28px', height: '28px', marginRight: '8px' }}
                  />
              ) : (
                  <LordIcon
                      src="https://cdn.lordicon.com/kkvxgpti.json"
                      trigger="hover"
                      colors="primary:#ffffff,secondary:#ffffff"
                      style={{ width: '28px', height: '28px', marginRight: '8px' }}
                  />
              )}
              {isLoading ? t('optimizing') : (hasSearched ? t('search_again') : t('find_my_trip'))}
            </button>
            {hasSearched && !isLoading && (
              <button
                type="button"
                onClick={handleClear}
                className="flex items-center justify-center bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold py-4 px-5 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 dark:focus:ring-offset-slate-900 transition duration-150 ease-in-out"
                aria-label={t('clear_search')}
              >
                <LordIcon
                    src="https://cdn.lordicon.com/nqtddedc.json"
                    trigger="hover"
                    colors="primary:#64748b,secondary:#9ca3af"
                    style={{ width: '28px', height: '28px' }}
                />
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};