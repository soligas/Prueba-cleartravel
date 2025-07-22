import React, { useState, useEffect } from 'react';
import type { Coordinates, CulinaryGem } from '../types';
import { FoodIcon, MapPinIcon } from './IconComponents';

interface CulinaryGemsProps {
  coordinates: Coordinates;
  destinationCityName: string;
  t: (key: string) => string;
  onGemsFetched: (gems: CulinaryGem[]) => void;
}

const CulinaryGemCard: React.FC<{ gem: CulinaryGem, t: (key: string) => string }> = ({ gem, t }) => {
    const handleViewOnMap = () => {
        const query = encodeURIComponent(`${gem.name}, ${gem.address}`);
        const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
            <div className="flex-grow">
                <div className="flex justify-between items-start">
                    <h3 className="font-bold text-indigo-600 dark:text-indigo-400 text-md mb-1 pr-2">{gem.name}</h3>
                    <span className="text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 px-2 py-1 rounded-full whitespace-nowrap">{gem.cuisineType}</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-start gap-1.5">
                  <MapPinIcon className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  <span>{gem.address}</span>
                </p>
                <p className="text-slate-600 dark:text-slate-300 mt-3 text-sm italic">"{gem.description}"</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                    onClick={handleViewOnMap}
                    className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                >
                    {t('view_on_map')} &rarr;
                </button>
            </div>
        </div>
    );
};

export const CulinaryGems: React.FC<CulinaryGemsProps> = ({ coordinates, destinationCityName, t, onGemsFetched }) => {
  const [gems, setGems] = useState<CulinaryGem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGems = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/culinary-gems', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ coordinates, destinationCityName }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch culinary gems');
        }
        const data: CulinaryGem[] = await response.json();
        setGems(data);
        onGemsFetched(data); // Pass data to parent
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        onGemsFetched([]); // Clear gems on error
      } finally {
        setIsLoading(false);
      }
    };
    fetchGems();
  }, [coordinates, destinationCityName, onGemsFetched]);

  if (isLoading) {
    return (
        <div className="text-center py-8 px-4 bg-slate-100/50 dark:bg-slate-800/50 rounded-lg">
            <p className="text-slate-600 dark:text-slate-400">{t('loading_culinary_gems')}</p>
        </div>
    );
  }

  if (error || gems.length === 0) {
    // Silently fail or show a subtle message if no gems are found, to not clutter the UI
    return null; 
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center justify-center gap-3">
            <FoodIcon className="w-6 h-6 text-amber-600 dark:text-amber-500" />
            {t('culinary_gems_title')}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">{t('culinary_gems_subtitle')}</p>
      </div>
      <div className="space-y-4">
        {gems.map((gem, index) => (
          <CulinaryGemCard key={index} gem={gem} t={t} />
        ))}
      </div>
    </div>
  );
};