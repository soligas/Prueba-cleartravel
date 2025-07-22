import React from 'react';
import type { GroundingSource } from '../types';
import { LinkIcon } from './IconComponents';

interface SourcesProps {
  sources: GroundingSource[];
  t: (key: string) => string;
}

export const Sources: React.FC<SourcesProps> = ({ sources, t }) => {
  if (!sources || sources.length === 0) {
    return null;
  }

  return (
    <div className="p-6 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4 flex items-center">
        <LinkIcon className="w-5 h-5 mr-2 text-slate-500 dark:text-slate-400" />
        {t('data_sources')}
      </h3>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2 text-sm">
        {sources.map((source, index) => (
          <li key={index} className="truncate">
            <a 
              href={source.uri} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-indigo-600 dark:text-indigo-400 hover:underline hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors duration-200 inline-flex items-center gap-1.5"
              title={source.title || source.uri}
            >
              <span className="truncate">{source.title || new URL(source.uri).hostname.replace('www.','')}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};