import React, { useState } from 'react';
import { SearchIcon } from './IconComponents';

interface FollowUpSearchProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  t: (key: string) => string;
}

export const FollowUpSearch: React.FC<FollowUpSearchProps> = ({ onSearch, isLoading, t }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch(query);
    setQuery('');
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 animate-fade-in">
      <form onSubmit={handleSubmit}>
        <label htmlFor="follow-up-query" className="block text-lg font-medium text-slate-700 dark:text-slate-300 mb-3">
          {t('refine_search_title')}
        </label>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            id="follow-up-query"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('refine_search_placeholder')}
            className="w-full px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold py-3 px-6 rounded-xl hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-purple-800 transition-all duration-300 disabled:from-slate-400 disabled:to-slate-500 dark:disabled:from-slate-600 dark:disabled:to-slate-700 disabled:cursor-not-allowed"
            disabled={isLoading || !query}
          >
            <SearchIcon className="w-5 h-5 mr-2" />
            {isLoading ? t('optimizing') : t('refine')}
          </button>
        </div>
      </form>
    </div>
  );
};