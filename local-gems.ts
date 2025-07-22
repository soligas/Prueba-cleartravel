

import type { LocalGem } from '../types';

// The Geoapify response format is a GeoJSON FeatureCollection
interface GeoapifyResponse {
    type: string;
    features: LocalGem[];
}

// Ensure the request body has the expected structure
interface RequestBody {
    lat: number;
    lon: number;
    destinationCityName: string; // Not used here, but part of the standard payload
}

export default async function handler(req: Request): Promise<Response> {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
    }

    if (!process.env.GEOAPIFY_KEY) {
        console.error('Geoapify API Key not configured on the server.');
        return new Response(JSON.stringify({ error: 'Server configuration error.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    try {
        const { lat, lon } = await req.json() as RequestBody;
        if (typeof lat !== 'number' || typeof lon !== 'number') {
            return new Response(JSON.stringify({ error: 'Latitude and longitude are required and must be numbers.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }
        
        // Fetch hotels and restaurants within a 2km radius
        const url = `https://api.geoapify.com/v2/places?` +
            `categories=accommodation.hotel,catering.restaurant` +
            `&filter=circle:${lon},${lat},2000` +
            `&limit=50&apiKey=${process.env.GEOAPIFY_KEY}`;
        
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Geoapify API error: ${response.statusText}`);
            return new Response(JSON.stringify({ error: 'Failed to fetch local data.' }), { status: response.status, headers: { 'Content-Type': 'application/json' } });
        }

        const data: GeoapifyResponse = await response.json();

        // Filter for high quality places (rating >= 4.2 stars)
        const highRated = data.features.filter(f => f.properties.rating && f.properties.rating >= 4.2);

        if (highRated.length === 0) {
            return new Response(JSON.stringify([]), { headers: { 'Content-Type': 'application/json' } });
        }

        // Filter for good price (value is <= 70th percentile of high-rated places)
        // We use a default price level if not provided, as some places may not have it.
        const prices = highRated.map(f => f.properties.price_level || 2); // Default to 'moderate'
        const p70 = [...prices].sort((a, b) => a - b)[Math.floor(prices.length * 0.7)];
        const curated = highRated.filter(f => (f.properties.price_level || 2) <= p70);
        
        // Return up to the top 10 curated results
        return new Response(JSON.stringify(curated.slice(0, 10)), { headers: { 'Content-Type': 'application/json' } });

    } catch (err) {
        console.error("Error in /api/local-gems handler:", err);
        const errorMessage = err instanceof Error ? err.message : 'An unexpected server error occurred.';
        return new Response(JSON.stringify({ error: errorMessage }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}