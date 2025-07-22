import React from 'react';
import type { Language, Currency, Theme } from '../types';
import { languages, currencies } from '../translations';
import { GlobeAltIcon, CurrencyDollarIcon } from './IconComponents';
import { LordIcon } from './LordIcon';

interface HeaderProps {
  t: (key: string) => string;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  language: Language;
  setLanguage: (language: Language) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  onLogoClick: () => void;
  onTitleClick: () => void;
  onFavoritesClick: () => void;
  favoritesCount: number;
  onLoginClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  t, 
  theme, 
  setTheme,
  language,
  setLanguage,
  currency,
  setCurrency,
  onLogoClick,
  onTitleClick,
  onFavoritesClick,
  favoritesCount,
  onLoginClick
}) => {
  return (
    <header className="bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-lg shadow-sm sticky top-0 z-30 border-b border-slate-900/10 dark:border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={onLogoClick} 
              className="flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-950 focus:ring-indigo-500 rounded-lg p-2 -ml-2"
              aria-label={t('go_to_homepage')}
            >
              <LordIcon
                src="https://cdn.lordicon.com/xrhwvtpt.json"
                trigger="hover"
                colors="primary:#4f46e5"
                style={{
                    width: '36px',
                    height: '36px',
                    transform: 'rotate(-45deg)'
                }}
              />
            </button>
            <button 
              onClick={onTitleClick}
              className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-950 focus:ring-indigo-500 rounded-lg p-2"
              aria-label={t('new_search')}
            >
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
                {t('ai_travel_planner')}
              </h1>
            </button>
          </div>

          <div className="flex items-center gap-1 md:gap-2">
            <div className="relative hidden md:flex items-center">
               <GlobeAltIcon className="w-5 h-5 text-slate-500 dark:text-slate-400 absolute left-3 pointer-events-none" />
               <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="pl-10 pr-2 py-2 text-sm bg-transparent border-0 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 focus:ring-2 focus:ring-indigo-500 rounded-md appearance-none cursor-pointer"
                aria-label="Select language"
              >
                {languages.map(lang => (
                    <option key={lang.code} value={lang.code} className="dark:bg-slate-800">{lang.name}</option>
                ))}
              </select>
            </div>

            <div className="relative hidden md:flex items-center">
              <CurrencyDollarIcon className="w-5 h-5 text-slate-500 dark:text-slate-400 absolute left-3 pointer-events-none" />
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="pl-10 pr-2 py-2 text-sm bg-transparent border-0 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 focus:ring-2 focus:ring-indigo-500 rounded-md appearance-none cursor-pointer"
                aria-label="Select currency"
              >
                {currencies.map(curr => (
                    <option key={curr.code} value={curr.code} className="dark:bg-slate-800">{curr.code}</option>
                ))}
              </select>
            </div>
            
            <button
              onClick={onFavoritesClick}
              className="relative p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-950 focus:ring-indigo-500"
              aria-label={t('favorites')}
            >
              <LordIcon
                  src="https://cdn.lordicon.com/ulnswmke.json"
                  trigger="hover"
                  colors={favoritesCount > 0 ? "primary:#e11d48,secondary:#9f1239" : "primary:#64748b,secondary:#64748b"}
                  style={{ width: '28px', height: '28px' }}
              />
              {favoritesCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white ring-2 ring-white dark:ring-slate-950">
                  {favoritesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-950 focus:ring-indigo-500"
              aria-label={t(theme === 'light' ? 'switch_to_dark_mode' : 'switch_to_light_mode')}
            >
              <LordIcon
                src={theme === 'light' 
                    ? "https://cdn.lordicon.com/dibbripk.json" // moon
                    : "https://cdn.lordicon.com/koyivthb.json" // sun
                }
                trigger="click"
                colors="primary:#64748b,secondary:#9ca3af"
                style={{ width: '28px', height: '28px' }}
              />
            </button>

            <button
              onClick={onLoginClick}
              className="hidden sm:inline-flex items-center justify-center bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-950 transition-colors text-sm ml-2"
            >
              {t('login_signup')}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};