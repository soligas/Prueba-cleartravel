

import { Duffel } from '@duffel/api';
import type { Flight, Currency } from '../types';

if (!process.env.DUFFEL_API_KEY) {
    throw new Error('Duffel API Key is not configured.');
}

const duffel = new Duffel({
    token: process.env.DUFFEL_API_KEY,
});

const mapDuffelOfferToFlight = (offer: any, adults: number): Flight => {
    const firstSlice = offer.slices[0];
    if (!firstSlice || !firstSlice.segments || firstSlice.segments.length === 0) {
        throw new Error('Invalid offer structure from Duffel');
    }
    const firstSegment = firstSlice.segments[0];
    const lastSegment = firstSlice.segments[firstSlice.segments.length - 1];

    // Simple convenience score based on number of stops
    let convenienceScore = 75;
    if (offer.slices[0].segments.length === 1) {
        convenienceScore = 95; // Non-stop
    } else if (offer.slices[0].segments.length === 2) {
        convenienceScore = 80; // 1 stop
    }

    const dateForUrl = firstSegment.departing_at.split('T')[0].replace(/-/g, '').substring(2);

    return {
        airline: firstSegment.operating_carrier.name,
        flightNumber: `${firstSegment.operating_carrier.iata_code}${firstSegment.operating_carrier_flight_number}`,
        origin: firstSegment.origin.iata_code,
        destination: lastSegment.destination.iata_code,
        departureTime: firstSegment.departing_at,
        arrivalTime: lastSegment.arriving_at,
        price: parseFloat(offer.total_amount),
        // Create a Skyscanner flights link for booking
        bookingUrl: `https://www.skyscanner.net/transport/flights/${firstSegment.origin.iata_code}/${lastSegment.destination.iata_code}/${dateForUrl}/?adults=${adults}`,
        convenienceScore: convenienceScore,
    };
};

interface FlightSearchParams {
    origin: string;
    destination: string;
    departureDate: string;
    adults: number;
    currency: Currency;
}

export const searchFlights = async (params: FlightSearchParams): Promise<Flight[]> => {
    try {
        const offerRequest = await duffel.offerRequests.create({
            slices: [{
                origin: params.origin,
                destination: params.destination,
                departure_date: params.departureDate,
            }] as any,
            passengers: Array(params.adults).fill({ type: 'adult' }),
            cabin_class: 'economy',
        });

        const response = await duffel.offers.list({
            offer_request_id: offerRequest.data.id,
            sort: 'total_amount',
            limit: 5, // Curate to the best 5 deals
        });

        return response.data.map(offer => mapDuffelOfferToFlight(offer, params.adults));
    } catch (error: any) {
        console.error('Duffel API Error:', error?.errors);
        throw new Error('Failed to fetch flight data from provider.');
    }
};