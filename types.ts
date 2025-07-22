

export interface Flight {
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  bookingUrl?: string;
  convenienceScore?: number;
}

export interface Hotel {
  name: string;
  rating: number;
  pricePerNight: number;
  amenities: string[];
  address?: string;
  summary?: string; // e.g., "Best for budget travelers"
  bookingUrl?: string;
  convenienceScore?: number;
}

export interface AirbnbListing {
  title: string;
  type: string; // e.g., "Entire apartment"
  guests: number;
  rating: number;
  pricePerNight: number;
  isSuperhost: boolean;
  photoUrl: string;
  bookingUrl?: string;
}

export interface ThingToDo {
  name: string;
  description: string;
  location: string;
}

export interface GroundingSource {
  uri: string;
  title: string;
}

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface TravelData {
  flights: Flight[];
  hotels: Hotel[];
  airbnbs?: AirbnbListing[];
  thingsToDo?: ThingToDo[];
  sources?: GroundingSource[];
  hotelSummary?: string; // e.g., A comparative summary of hotel options.
  destinationCoordinates?: Coordinates;
  destinationCityName?: string;
  tripCostSummary?: TripCostSummary;
}

export type FavoriteItem = 
  | { type: 'flight'; item: Flight }
  | { type: 'hotel'; item: Hotel }
  | { type: 'airbnb'; item: AirbnbListing };
  
export type ComparisonItem =
  | { type: 'flight'; item: Flight }
  | { type: 'hotel'; item: Hotel }
  | { type: 'airbnb'; item: AirbnbListing };

export type Language = 
  | 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' 
  | 'ru' | 'zh' | 'ja' | 'ko' | 'ar';

export type Currency = 
  | 'USD' | 'EUR' | 'JPY' | 'GBP' | 'AUD' | 'CAD' | 'CHF'
  | 'CNY' | 'HKD' | 'INR' | 'BRL' | 'RUB' | 'KRW' | 'SGD' | 'NZD';

export type Theme = 'light' | 'dark';
export type View = 'landing' | 'planner' | 'favorites' | 'comparison';

export interface LocalGem {
  type: string;
  properties: {
    name: string;
    categories: string[];
    rating?: number;
    price_level?: number;
    website?: string;
    address_line2: string;
    place_id: string;
  };
  geometry: {
    type: string;
    coordinates: [number, number]; // [lon, lat]
  };
}

export interface InfluencerPick {
  name: string;
  category: 'Restaurant' | 'Hotel' | 'Attraction';
  influencerName: string;
  sourceUrl: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface CulinaryGem {
  name: string;
  description: string;
  cuisineType: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface TripCostSummary {
  dailyFoodEstimate: number;
  totalTripEstimate: number;
  summary: string;
}