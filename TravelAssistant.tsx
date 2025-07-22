import React from 'react';
import { LightbulbIcon } from './IconComponents';

interface TravelAssistantProps {
  tips: string;
  isLoading: boolean;
  t: (key: string) => string;
}

const TypingIndicator = () => (
  <div className="flex items-center space-x-1">
    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></span>
  </div>
);

export const TravelAssistant: React.FC<TravelAssistantProps> = ({ tips, isLoading, t }) => {
  return (
    <div className="bg-slate-100 dark:bg-slate-900 border-l-4 border-indigo-500 p-5 rounded-r-lg shadow-lg">
      <div className="flex">
        <div className="py-1">
          <LightbulbIcon className="w-6 h-6 text-indigo-500 mr-4"/>
        </div>
        <div>
          <p className="font-bold text-indigo-800 dark:text-indigo-300">{t('ai_travel_tip')}</p>
          <div className="text-md text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
            {tips}
            {isLoading && <TypingIndicator />}
          </div>
        </div>
      </div>
    </div>
  );
};