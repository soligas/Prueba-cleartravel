
import Amadeus from 'amadeus';
import type { Hotel, Currency, Coordinates } from '../types';

if (!process.env.AMADEUS_CLIENT_ID || !process.env.AMADEUS_CLIENT_SECRET) {
    throw new Error('Amadeus API credentials are not configured.');
}

const amadeus = new Amadeus({
    clientId: process.env.AMADEUS_CLIENT_ID,
    clientSecret: process.env.AMADEUS_CLIENT_SECRET,
});

const mapAmadeusToHotel = (offer: any, hotelData: any, params: HotelSearchParams): Hotel => {
    // Simple convenience score based on rating
    const rating = hotelData.rating ? parseInt(hotelData.rating, 10) : 3;
    const convenienceScore = 40 + (rating * 10); // Scale from 50 (1 star) to 90 (5 stars)

    const checkIn = new Date(params.checkInDate);
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkOut.getDate() + params.nights);
    
    const formatDateForUrl = (date: Date) => date.toISOString().split('T')[0].replace(/-/g, '').substring(2);

    const checkInUrl = formatDateForUrl(checkIn);
    const checkOutUrl = formatDateForUrl(checkOut);

    return {
        name: hotelData.name,
        rating: rating,
        pricePerNight: parseFloat(offer.price.total),
        amenities: hotelData.amenities || [],
        address: [hotelData.address.lines?.[0], hotelData.address.cityName, hotelData.address.postalCode]
            .filter(Boolean)
            .join(', '),
        summary: offer.room?.description?.text?.split('.')[0] || 'Great hotel option',
        // Create a Skyscanner hotel link for booking
        bookingUrl: `https://www.skyscanner.net/hotels/${params.city.toLowerCase()}/${checkInUrl}/${checkOutUrl}/?adults=${params.adults}`,
        convenienceScore: convenienceScore,
    };
};

interface HotelSearchParams {
    city: string;
    checkInDate: string;
    nights: number;
    adults: number;
    currency: Currency;
}

interface HotelSearchResult {
    hotels: Hotel[];
    coordinates: Coordinates | null;
}

export const searchHotels = async (params: HotelSearchParams): Promise<HotelSearchResult> => {
    try {
        // 1. Get the IATA code for the city
        const citySearchResponse = await amadeus.referenceData.locations.get({
            keyword: params.city,
            subType: 'CITY',
        });
        
        if (!citySearchResponse.data || citySearchResponse.data.length === 0) {
            throw new Error(`Could not find city: ${params.city}`);
        }
        const cityInfo = citySearchResponse.data[0];
        const cityCode = cityInfo.iataCode;
        const coordinates = cityInfo.geoCode ? { lat: cityInfo.geoCode.latitude, lon: cityInfo.geoCode.longitude } : null;

        // 2. Search for hotels using the city code
        const hotelResponse = await amadeus.shopping.hotelOffers.get({
            cityCode: cityCode,
            checkInDate: params.checkInDate,
            roomQuantity: 1,
            adults: params.adults,
            radius: 20,
            radiusUnit: 'KM',
            ratings: '2,3,4,5', // Get a range of hotels
            currency: params.currency,
            paymentPolicy: 'NONE',
            sort: 'PRICE',
            view: 'FULL',
            bestRateOnly: true,
        });

        if (!hotelResponse.data || hotelResponse.data.length === 0) {
            return { hotels: [], coordinates: coordinates };
        }
        
        // Curate to the best 5 results
        const curatedOffers = hotelResponse.data.slice(0, 5);
        const hotels = curatedOffers.map((offer: any) => mapAmadeusToHotel(offer, offer.hotel, params));

        return { hotels, coordinates };
    } catch (error: any) {
        console.error('Amadeus API Error:', error?.description || error?.message);
        throw new Error('Failed to fetch hotel data from provider.');
    }
};