


import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { SearchForm } from './components/SearchForm';
import { FlightResults } from './components/FlightResults';
import { HotelResults } from './components/HotelResults';
import { AirbnbResults } from './components/AirbnbResults';
import { ThingsToDo } from './components/ThingsToDo';
import { TravelAssistant } from './components/TravelAssistant';
import { LoadingSpinner } from './components/LoadingSpinner';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Sources } from './components/Sources';
import { LandingPage } from './components/LandingPage';
import { Footer } from './components/Footer';
import { ComparisonProvider } from './context/ComparisonContext';
import { ComparisonTray } from './components/ComparisonTray';
import { ComparisonSheet } from './components/ComparisonSheet';
import { LocalGems } from './components/LocalGems';
import { CulinaryGems } from './components/CulinaryGems';
import { TripCostSummary } from './components/TripCostSummary';
import { getTravelDataStream } from './services/geminiService';
import { translations, currencySymbols } from './translations';
import { LordIcon } from './components/LordIcon';
import { ScrollToTopButton } from './components/ScrollToTopButton';
import { FollowUpSearch } from './components/FollowUpSearch';
import { InspireMeModal } from './components/InspireMeModal';
import type { Flight, Hotel, AirbnbListing, ThingToDo, GroundingSource, FavoriteItem, Language, Currency, Theme, View, Coordinates, TripCostSummary as TripCostSummaryType, CulinaryGem } from './types';

const useLocalStorage = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
        return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
        console.error(error);
    }
  };

  return [storedValue, setValue];
};


const AppContent: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [flights, setFlights] = useLocalStorage<Flight[]>('flights', []);
  const [hotels, setHotels] = useLocalStorage<Hotel[]>('hotels', []);
  const [airbnbs, setAirbnbs] = useLocalStorage<AirbnbListing[]>('airbnbs', []);
  const [thingsToDo, setThingsToDo] = useLocalStorage<ThingToDo[]>('thingsToDo', []);
  const [travelTips, setTravelTips] = useLocalStorage<string>('travelTips', '');
  const [sources, setSources] = useLocalStorage<GroundingSource[]>('sources', []);
  const [hotelSummary, setHotelSummary] = useLocalStorage<string | null>('hotelSummary', null);
  const [destinationCoordinates, setDestinationCoordinates] = useLocalStorage<Coordinates | null>('destinationCoordinates', null);
  const [destinationCityName, setDestinationCityName] = useLocalStorage<string | null>('destinationCityName', null);
  const [hasSearched, setHasSearched] = useLocalStorage<boolean>('hasSearched', false);
  const [favorites, setFavorites] = useLocalStorage<FavoriteItem[]>('favorites', []);
  const [tripCostSummary, setTripCostSummary] = useLocalStorage<TripCostSummaryType | null>('tripCostSummary', null);
  const [culinaryGems, setCulinaryGems] = useLocalStorage<CulinaryGem[]>('culinaryGems', []);
  const [searchQuery, setSearchQuery] = useLocalStorage<string>('searchQuery', '');
  const [originalQuery, setOriginalQuery] = useLocalStorage<string>('originalQuery', '');
  
  const [view, setView] = useLocalStorage<View>('view', 'landing');
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'dark'); // Default to dark theme
  const [language, setLanguage] = useLocalStorage<Language>('language', 'en');
  const [currency, setCurrency] = useLocalStorage<Currency>('currency', 'USD');
  
  const [isComparisonSheetOpen, setComparisonSheetOpen] = useState(false);
  const [isInspireModalOpen, setInspireModalOpen] = useState(false);
  const [isGeneratingInspiration, setIsGeneratingInspiration] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);
  
  useEffect(() => {
    document.documentElement.lang = language.split('-')[0];
  }, [language]);

  const t = useCallback((key: string): string => (translations[language] && translations[language][key]) || key, [language]);

  const resetState = (clearSearchState = true) => {
    setFlights([]);
    setHotels([]);
    setAirbnbs([]);
    setThingsToDo([]);
    setTravelTips('');
    setSources([]);
    setHotelSummary(null);
    setDestinationCoordinates(null);
    setDestinationCityName(null);
    setError(null);
    setTripCostSummary(null);
    setCulinaryGems([]);
    if(clearSearchState) {
      setHasSearched(false);
      setOriginalQuery('');
      setSearchQuery('');
    }
  };

  const handleSearch = useCallback(async (query: string, isInitialSearch = false) => {
    if (!query.trim()) {
      setError('Please enter your travel plans.');
      return;
    }
    
    if (isInitialSearch) {
        setOriginalQuery(query);
        setSearchQuery(query);
    }
    
    setIsLoading(true);
    resetState(false);
    setHasSearched(true);
    setView('planner');

    try {
      const stream = getTravelDataStream(query, currency);
      for await (const chunk of stream) {
        if (chunk.type === 'data') {
          if (chunk.payload.flights) setFlights(prev => [...prev, ...chunk.payload.flights]);
          if (chunk.payload.hotels) setHotels(prev => [...prev, ...chunk.payload.hotels]);
          if (chunk.payload.airbnbs) setAirbnbs(prev => [...prev, ...chunk.payload.airbnbs]);
          if (chunk.payload.thingsToDo) setThingsToDo(prev => [...prev, ...chunk.payload.thingsToDo]);
          if (chunk.payload.sources) setSources(prev => [...prev, ...chunk.payload.sources]);
          if (chunk.payload.hotelSummary) setHotelSummary(chunk.payload.hotelSummary);
          if (chunk.payload.destinationCoordinates) setDestinationCoordinates(chunk.payload.destinationCoordinates);
          if (chunk.payload.destinationCityName) setDestinationCityName(chunk.payload.destinationCityName);
        } else if (chunk.type === 'tip') {
          setTravelTips(prev => prev + chunk.payload);
        } else if (chunk.type === 'cost_summary') {
          setTripCostSummary(chunk.payload);
        } else if (chunk.type === 'error') {
          setError(chunk.payload);
        }
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred. Please check the console for details.');
    } finally {
      setIsLoading(false);
    }
  }, [currency, setFlights, setHotels, setThingsToDo, setSources, setHotelSummary, setTravelTips, setError, setHasSearched, setView, setDestinationCoordinates, setDestinationCityName, setTripCostSummary, setOriginalQuery, setSearchQuery, setAirbnbs]);

  const handleExampleClick = (query: string) => {
    handleSearch(query, true);
  };

  const handleInspirationSearch = async (prefs: { tripType: string; region: string; budget: string }) => {
    setIsGeneratingInspiration(true);
    setError(null);
    try {
        const response = await fetch('/api/inspire', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...prefs, currentCity: 'New York' }), // Hardcoding origin for now
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to generate inspiration.');
        }
        
        const { query } = await response.json();

        setInspireModalOpen(false);
        await handleSearch(query, true);

    } catch (err) {
        const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
        console.error(message);
        setError(message);
        setInspireModalOpen(false); // Close modal on error too
    } finally {
        setIsGeneratingInspiration(false);
    }
  };

  const handleFollowUpSearch = async (followUpQuery: string) => {
    const newQuery = `My original request was "${originalQuery}". Now I want to refine it. Please ${followUpQuery}. Keep the parts of the original request that are not being changed.`;
    await handleSearch(newQuery, false);
  };

  const getItemId = (item: any, type: 'flight' | 'hotel' | 'airbnb'): string => {
      switch (type) {
        case 'flight': return item.flightNumber + item.departureTime;
        case 'hotel': return item.name;
        case 'airbnb': return item.title;
        default: return '';
      }
  };

  const handleToggleFavorite = useCallback((item: Flight | Hotel | AirbnbListing, type: 'flight' | 'hotel' | 'airbnb') => {
    setFavorites(prev => {
      const itemId = getItemId(item, type);
      const index = prev.findIndex(fav => fav.type === type && getItemId(fav.item, fav.type) === itemId);

      if (index > -1) {
        return [...prev.slice(0, index), ...prev.slice(index + 1)];
      } else {
        return [...prev, { type, item } as FavoriteItem];
      }
    });
  }, [setFavorites]);
  
  const isFavorite = useCallback((item: Flight | Hotel | AirbnbListing, type: 'flight' | 'hotel' | 'airbnb'): boolean => {
    const itemId = getItemId(item, type);
    return favorites.some(fav => fav.type === type && getItemId(fav.item, fav.type) === itemId);
  }, [favorites]);
  
  const getCurrencySymbol = useCallback((currencyCode: Currency) => {
    return currencySymbols[currencyCode] || currencyCode;
  }, []);

  const handleBookNow = (url: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const renderPlanner = () => {
    const currentCurrencySymbol = getCurrencySymbol(currency);
    const showLoadingSpinner = isLoading && !travelTips && flights.length === 0 && hotels.length === 0 && airbnbs.length === 0;
    const showInitialError = error && !hasSearched;
    
    if (!hasSearched) {
       return <WelcomeScreen onExampleClick={handleExampleClick} t={t} onInspireClick={() => setInspireModalOpen(true)} />;
    }

    if (showLoadingSpinner) return <LoadingSpinner t={t} />;
    
    if (showInitialError) {
      return <div className="text-center text-red-500 mt-8 text-lg bg-red-50 dark:bg-red-900/20 dark:text-red-400 p-4 rounded-lg">{error}</div>;
    }

    const hasResults = flights.length > 0 || hotels.length > 0 || airbnbs.length > 0;
    const showSidebar = hasResults || (isLoading && travelTips);

    return (
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-x-8 xl:gap-x-12">
        {/* Main Content */}
        <div className={showSidebar ? "lg:col-span-3 space-y-10" : "lg:col-span-5 space-y-10"}>
          <FlightResults flights={flights} isLoading={isLoading} currencySymbol={currentCurrencySymbol} t={t} onToggleFavorite={handleToggleFavorite} isFavorite={isFavorite} onBookNow={handleBookNow} />
          <HotelResults hotels={hotels} isLoading={isLoading} hotelSummary={hotelSummary} currencySymbol={currentCurrencySymbol} t={t} onToggleFavorite={handleToggleFavorite} isFavorite={isFavorite} onBookNow={handleBookNow} />
          <AirbnbResults airbnbs={airbnbs} isLoading={isLoading} currencySymbol={currentCurrencySymbol} t={t} onToggleFavorite={handleToggleFavorite} isFavorite={isFavorite} onBookNow={handleBookNow} />
          <ThingsToDo things={thingsToDo} isLoading={isLoading} t={t} />
          {error && <div className="text-center text-red-500 dark:text-red-400 text-md bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">{error}</div>}
          {sources.length > 0 && <Sources sources={sources} t={t} />}
          {hasSearched && !isLoading && hasResults && (
            <FollowUpSearch onSearch={handleFollowUpSearch} isLoading={isLoading} t={t} />
          )}
        </div>
        
        {/* Sticky Sidebar */}
        {showSidebar && (
          <aside className="lg:col-span-2 space-y-8 mt-8 lg:mt-0">
            <div className="lg:sticky lg:top-24 space-y-8">
              {(travelTips || (isLoading && !travelTips)) && <TravelAssistant tips={travelTips} isLoading={isLoading && !travelTips} t={t} />}
              {tripCostSummary && flights.length > 0 && hotels.length > 0 && (
                <TripCostSummary
                    summary={tripCostSummary}
                    flightCost={flights[0].price}
                    hotelCost={hotels[0].pricePerNight}
                    currencySymbol={currentCurrencySymbol}
                    t={t}
                />
              )}
               {destinationCoordinates && (
                  <>
                    <CulinaryGems coordinates={destinationCoordinates} destinationCityName={destinationCityName || ''} t={t} onGemsFetched={setCulinaryGems} />
                    <LocalGems coordinates={destinationCoordinates} destinationCityName={destinationCityName || ''} t={t} culinaryGems={culinaryGems} />
                  </>
                )}
            </div>
          </aside>
        )}
      </div>
    );
  };

  const renderFavorites = () => {
    const favoriteFlights = favorites.filter((f): f is { type: 'flight', item: Flight } => f.type === 'flight');
    const favoriteHotels = favorites.filter((f): f is { type: 'hotel', item: Hotel } => f.type === 'hotel');
    const favoriteAirbnbs = favorites.filter((f): f is { type: 'airbnb', item: AirbnbListing } => f.type === 'airbnb');
    const currentCurrencySymbol = getCurrencySymbol(currency);
    
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-4xl font-bold tracking-tight text-slate-800 dark:text-slate-100">{t('my_favorites')}</h2>
                <button onClick={() => setView('planner')} className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">{t('back_to_planner')}</button>
            </div>
            
            {favorites.length === 0 ? (
                <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <LordIcon
                        src="https://cdn.lordicon.com/ulnswmke.json"
                        trigger="loop"
                        delay={2000}
                        colors="primary:#94a3b8,secondary:#e2e8f0"
                        style={{ width: '64px', height: '64px', margin: '0 auto 1rem auto' }}
                    />
                    <p className="text-slate-600 dark:text-slate-400 font-semibold text-lg">{t('no_favorites_yet')}</p>
                    <p className="text-sm text-slate-500 mb-6">{t('no_favorites_desc')}</p>
                    <button 
                        onClick={() => { setView('planner'); resetState(true); }}
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-2.5 px-6 rounded-lg hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800 transition-all duration-300"
                    >
                        {t('start_planning_button')}
                    </button>
                </div>
            ) : (
                <div className="space-y-12">
                    {favoriteFlights.length > 0 && <FlightResults title={t('saved_flights')} flights={favoriteFlights.map(f => f.item)} isLoading={false} currencySymbol={currentCurrencySymbol} t={t} onToggleFavorite={handleToggleFavorite} isFavorite={isFavorite} onBookNow={handleBookNow} />}
                    {favoriteHotels.length > 0 && <HotelResults title={t('saved_hotels')} hotels={favoriteHotels.map(f => f.item)} isLoading={false} currencySymbol={currentCurrencySymbol} t={t} onToggleFavorite={handleToggleFavorite} isFavorite={isFavorite} onBookNow={handleBookNow} />}
                    {favoriteAirbnbs.length > 0 && <AirbnbResults title={t('saved_airbnbs')} airbnbs={favoriteAirbnbs.map(f => f.item)} isLoading={false} currencySymbol={currentCurrencySymbol} t={t} onToggleFavorite={handleToggleFavorite} isFavorite={isFavorite} onBookNow={handleBookNow} />}
                </div>
            )}
        </div>
    )
  };

  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[9999] focus:top-0 focus:left-0 focus:m-2 focus:p-3 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 focus:rounded-lg focus:shadow-lg focus:ring-2 focus:ring-indigo-500">
        {t('skip_to_main_content')}
      </a>
      <div className="flex flex-col min-h-screen">
        <Header
          t={t}
          theme={theme}
          setTheme={setTheme}
          language={language}
          setLanguage={setLanguage}
          currency={currency}
          setCurrency={setCurrency}
          onLogoClick={() => setView('landing')}
          onTitleClick={() => { setView('planner'); resetState(true); }}
          onFavoritesClick={() => setView('favorites')}
          favoritesCount={favorites.length}
          onLoginClick={() => alert('Login feature coming soon!')}
        />
        
        <main id="main-content" className="flex-grow">
          {view === 'landing' && <LandingPage onGetStarted={() => { setView('planner'); resetState(true); }} t={t} />}
          
          {(view === 'planner' || view === 'favorites') && (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              {view === 'planner' && (
                <>
                  <div className="my-8">
                     <SearchForm 
                      onSearch={(q) => handleSearch(q, true)} 
                      isLoading={isLoading} 
                      hasSearched={hasSearched} 
                      onClear={() => resetState(true)} 
                      t={t}
                      query={searchQuery}
                      setQuery={setSearchQuery}
                     />
                  </div>
                  <div className="mt-10">
                    {renderPlanner()}
                  </div>
                </>
              )}
              {view === 'favorites' && (
                <div className="my-8">
                  {renderFavorites()}
                </div>
              )}
            </div>
          )}
        </main>
        
        <Footer t={t} />
      </div>

      {view === 'planner' && hasSearched && (
        <>
          <ComparisonTray onOpen={() => setComparisonSheetOpen(true)} t={t} />
          <ComparisonSheet 
            isOpen={isComparisonSheetOpen} 
            onClose={() => setComparisonSheetOpen(false)}
            onBookNow={handleBookNow}
            currencySymbol={getCurrencySymbol(currency)}
            t={t} 
          />
        </>
      )}

      <ScrollToTopButton t={t} />

      <InspireMeModal
          isOpen={isInspireModalOpen}
          onClose={() => setInspireModalOpen(false)}
          onGenerate={handleInspirationSearch}
          isGenerating={isGeneratingInspiration}
          t={t}
      />
    </>
  );
};

const App: React.FC = () => (
  <ComparisonProvider>
    <AppContent />
  </ComparisonProvider>
);


export default App;