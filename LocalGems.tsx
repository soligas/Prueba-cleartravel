

import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPinIcon, StarIcon, BedIcon, MegaphoneIcon } from './IconComponents';
import type { Coordinates, LocalGem, InfluencerPick, CulinaryGem } from '../types';

interface LocalGemsProps {
  coordinates: Coordinates;
  destinationCityName: string;
  t: (key: string) => string;
  culinaryGems: CulinaryGem[];
}

const BedIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-white"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6h1.5m-1.5 3h1.5m-1.5 3h1.5M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>`;
const RestaurantIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-white"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 12.75V12A2.25 2.25 0 0019.5 9.75h-4.5M21.75 12.75v3.375c0 .621-.504 1.125-1.125 1.125h-9.75c-.621 0-1.125-.504-1.125-1.125V12.75m0 0h13.5M2.25 12.75v3.375c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V12.75m-12 0h-1.5a2.25 2.25 0 00-2.25 2.25v.75M7.5 12.75v-3.75m0 0a2.25 2.25 0 012.25-2.25h3a2.25 2.25 0 012.25 2.25v3.75m-7.5 0h7.5" /></svg>`;
const MegaphoneIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-white"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>`
const FoodIconSVG = RestaurantIconSVG; // Re-use for now

const createMarkerIcon = (type: 'hotel' | 'restaurant' | 'influencer' | 'culinary') => {
  let bgColor = '';
  let iconSVG = '';
  switch(type) {
    case 'hotel':
      bgColor = 'bg-blue-600';
      iconSVG = BedIconSVG;
      break;
    case 'restaurant':
      bgColor = 'bg-amber-600';
      iconSVG = RestaurantIconSVG;
      break;
    case 'influencer':
      bgColor = 'bg-purple-600';
      iconSVG = MegaphoneIconSVG;
      break;
    case 'culinary':
      bgColor = 'bg-rose-600';
      iconSVG = FoodIconSVG;
      break;
  }
  const iconHtml = `<div class="w-8 h-8 rounded-full flex items-center justify-center text-white ${bgColor}" style="box-shadow: 0 4px 12px rgba(0,0,0,0.3); border: 2px solid white;">${iconSVG}</div>`;
  return L.divIcon({
    html: iconHtml,
    className: 'bg-transparent border-0',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

const MapUpdater: React.FC<{center: [number, number]}> = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
}

const GemPopup: React.FC<{ gem: LocalGem, t: (key: string) => string }> = ({ gem, t }) => {
  const { name, rating, price_level, website, address_line2 } = gem.properties;

  const getPriceDescription = () => {
    switch (price_level) {
      case 1: return t('price_level_1');
      case 2: return t('price_level_2');
      case 3: return t('price_level_3');
      case 4: return t('price_level_4');
      default: return '';
    }
  };

  return (
    <div className="w-56">
      <h4 className="font-bold text-md text-slate-800">{name}</h4>
      <p className="text-sm text-slate-600">{address_line2}</p>
      <div className="flex items-center justify-between mt-2 text-sm">
        <div className="flex items-center gap-1">
          <StarIcon className="w-4 h-4 text-yellow-400" />
          <span className="font-semibold text-slate-700">{rating}</span>
        </div>
        {price_level && <span className="text-slate-500">{getPriceDescription()}</span>}
      </div>
      {website && (
        <a href={website} target="_blank" rel="noopener noreferrer" className="block w-full text-center mt-3 bg-blue-600 text-white text-sm font-semibold rounded-md py-1.5 hover:bg-blue-700 transition-colors">
          {t('view_website')}
        </a>
      )}
    </div>
  );
};

const InfluencerPopup: React.FC<{ pick: InfluencerPick, t: (key: string) => string }> = ({ pick, t }) => {
  const { name, influencerName, sourceUrl, address } = pick;

  return (
    <div className="w-60">
      <h4 className="font-bold text-md text-slate-800">{name}</h4>
      <p className="text-sm text-slate-600">{address}</p>
      <div className="mt-2 text-sm text-slate-500 italic">
        {t('recommended_by')}{' '}
        <span className="font-semibold text-purple-600">{influencerName}</span>
      </div>
      {sourceUrl && (
        <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="block w-full text-center mt-3 bg-purple-600 text-white text-sm font-semibold rounded-md py-1.5 hover:bg-purple-700 transition-colors">
          {t('view_source')}
        </a>
      )}
    </div>
  );
};

const CulinaryPopup: React.FC<{ gem: CulinaryGem, t: (key: string) => string }> = ({ gem, t }) => {
  const { name, cuisineType, address, description } = gem;
  return (
    <div className="w-60">
      <h4 className="font-bold text-md text-slate-800">{name}</h4>
      <p className="text-xs font-semibold text-rose-800 dark:text-rose-300">{cuisineType}</p>
      <p className="text-sm text-slate-600 mt-1">{address}</p>
      <p className="text-sm text-slate-500 italic mt-2">"{description}"</p>
    </div>
  );
};

export const LocalGems: React.FC<LocalGemsProps> = ({ coordinates, destinationCityName, t, culinaryGems }) => {
  const [gems, setGems] = useState<LocalGem[]>([]);
  const [influencerPicks, setInfluencerPicks] = useState<InfluencerPick[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllDiscoveries = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const payload = {
            ...coordinates,
            destinationCityName,
        };

        const [gemsResponse, picksResponse] = await Promise.all([
          fetch('/api/local-gems', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          }),
          fetch('/api/influencer-picks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
        ]);

        if (!gemsResponse.ok) throw new Error('Failed to fetch local gems');
        if (!picksResponse.ok) throw new Error('Failed to fetch influencer picks');
        
        const gemsData: LocalGem[] = await gemsResponse.json();
        const picksData: InfluencerPick[] = await picksResponse.json();

        setGems(gemsData);
        setInfluencerPicks(picksData);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllDiscoveries();
  }, [coordinates, destinationCityName]);
  
  const hotelIcon = useMemo(() => createMarkerIcon('hotel'), []);
  const restaurantIcon = useMemo(() => createMarkerIcon('restaurant'), []);
  const influencerIcon = useMemo(() => createMarkerIcon('influencer'), []);
  const culinaryIcon = useMemo(() => createMarkerIcon('culinary'), []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center py-8 px-4 bg-slate-100 dark:bg-slate-800 rounded-lg border dark:border-slate-700">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-slate-600 dark:text-slate-400">{t('loading_discoveries')}</p>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="text-center py-8 px-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      );
    }
    
    if (gems.length === 0 && influencerPicks.length === 0 && culinaryGems.length === 0) {
      return (
        <div className="text-center py-8 px-4 bg-slate-100 dark:bg-slate-800 rounded-lg border dark:border-slate-700">
          <p className="text-slate-600 dark:text-slate-400">{t('no_discoveries_found')}</p>
          <p className="text-sm text-slate-500 dark:text-slate-500">{t('no_discoveries_found_desc')}</p>
        </div>
      );
    }

    const center: [number, number] = [coordinates.lat, coordinates.lon];

    return (
        <div className="relative h-[28rem] w-full rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md">
            <MapContainer center={center} zoom={14} scrollWheelZoom={false} className="h-full w-full">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapUpdater center={center} />
                {gems.map(gem => {
                    const isHotel = gem.properties.categories.includes('accommodation.hotel');
                    return (
                        <Marker
                            key={gem.properties.place_id}
                            position={[gem.geometry.coordinates[1], gem.geometry.coordinates[0]]}
                            icon={isHotel ? hotelIcon : restaurantIcon}
                        >
                            <Popup>
                                <GemPopup gem={gem} t={t} />
                            </Popup>
                        </Marker>
                    )
                })}
                 {influencerPicks.map(pick => (
                    <Marker
                        key={pick.name}
                        position={[pick.latitude, pick.longitude]}
                        icon={influencerIcon}
                    >
                         <Popup>
                            <InfluencerPopup pick={pick} t={t} />
                        </Popup>
                    </Marker>
                 ))}
                 {culinaryGems.map(gem => (
                    <Marker
                        key={`${gem.name}-${gem.latitude}`}
                        position={[gem.latitude, gem.longitude]}
                        icon={culinaryIcon}
                    >
                         <Popup>
                            <CulinaryPopup gem={gem} t={t} />
                        </Popup>
                    </Marker>
                 ))}
            </MapContainer>
            <div className="absolute bottom-2 right-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-2 rounded-lg text-xs flex flex-col gap-1 shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                <span className="text-slate-700 dark:text-slate-200">{t('hotel')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-600"></span>
                <span className="text-slate-700 dark:text-slate-200">{t('restaurant')}</span>
              </div>
               <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-600"></span>
                <span className="text-slate-700 dark:text-slate-200">{t('culinary_pick')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-purple-600"></span>
                <span className="text-slate-700 dark:text-slate-200">{t('influencer_picks')}</span>
              </div>
            </div>
        </div>
    );
  };


  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center justify-center gap-3">
          <MapPinIcon className="w-6 h-6 text-blue-600 dark:text-blue-500" />
          {t('discovery_map_title')}
        </h2>
        <p className="text-slate-500 dark:text-slate-400">{t('discovery_map_subtitle')}</p>
      </div>
      {renderContent()}
    </div>
  );
};