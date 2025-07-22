import React from 'react';
import { ArrowRightIcon } from './IconComponents';
import { LordIcon } from './LordIcon';

interface WelcomeScreenProps {
  onExampleClick: (query: string) => void;
  onInspireClick: () => void;
  t: (key: string) => string;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onExampleClick, onInspireClick, t }) => {
  const exampleQueries = [
    t('example_1'),
    t('example_2'),
    t('example_3'),
  ];

  return (
    <div className="text-center bg-transparent p-8">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">{t('welcome_title')}</h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
          {t('welcome_subtitle')}
        </p>
        <div className="text-left max-w-2xl mx-auto">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-4">{t('try_examples')}</p>
          <div className="space-y-3">
            {exampleQueries.map((query, index) => (
              <button
                key={index}
                onClick={() => onExampleClick(query)}
                className="w-full text-left p-4 bg-white dark:bg-slate-800/50 rounded-lg hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-800 dark:hover:text-indigo-300 transition-all duration-200 flex items-center justify-between group border border-slate-200 dark:border-slate-700/80 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md"
              >
                <span className="italic text-slate-600 dark:text-slate-300 group-hover:text-indigo-800 dark:group-hover:text-indigo-300 transition-colors">"{query}"</span>
                <ArrowRightIcon className="w-5 h-5 text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-200" />
              </button>
            ))}
          </div>

          <div className="my-8 flex items-center text-center">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
            <span className="flex-shrink mx-4 text-slate-500 dark:text-slate-400 font-semibold text-sm">{t('or')}</span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
          </div>

          <button
            onClick={onInspireClick}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-8 rounded-xl hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-purple-300 dark:focus:ring-indigo-800 transition-all duration-300 transform hover:scale-105"
          >
            <LordIcon
              src="https://cdn.lordicon.com/soseozvi.json"
              trigger="loop-on-hover"
              colors="primary:#ffffff,secondary:#ffffff"
              style={{ width: '28px', height: '28px' }}
            />
            {t('inspire_me_button')}
          </button>
        </div>
    </div>
  );
};