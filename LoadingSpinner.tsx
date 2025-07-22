import React from 'react';
import { LordIcon } from './LordIcon';

interface LoadingSpinnerProps {
  t: (key: string) => string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ t }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <LordIcon
          src="https://cdn.lordicon.com/dflprrln.json"
          trigger="loop"
          colors="primary:#4f46e5,secondary:#a5b4fc"
          style={{ width: '100px', height: '100px' }}
      />
      <p className="mt-4 text-lg font-semibold text-slate-700 dark:text-slate-300">{t('loading_title')}</p>
      <p className="text-slate-500 dark:text-slate-400">{t('loading_subtitle')}</p>
    </div>
  );
};