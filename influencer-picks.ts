

import { GoogleGenAI, Type } from "@google/genai";
import type { InfluencerPick } from '../types';

interface RequestBody {
    lat: number;
    lon: number;
    destinationCityName: string;
}

const responseSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            name: { type: Type.STRING, description: "The name of the place." },
            category: { type: Type.STRING, enum: ['Restaurant', 'Hotel', 'Attraction'], description: "The category of the place." },
            influencerName: { type: Type.STRING, description: "A plausible-sounding but fictional travel influencer name (e.g., 'Wanderlust Chloe', 'Nomad Matt')." },
            sourceUrl: { type: Type.STRING, description: "A plausible but fake URL to a blog or social media post (e.g., 'https://instagram.com/p/12345', 'https://wanderlustchloe.com/tokyo-guide')." },
            address: { type: Type.STRING, description: "A brief, approximate address or neighborhood for the place." },
            latitude: { type: Type.NUMBER, description: "The latitude of the place." },
            longitude: { type: Type.NUMBER, description: "The longitude of the place." },
        },
        required: ["name", "category", "influencerName", "sourceUrl", "address", "latitude", "longitude"],
    },
};

export default async function handler(req: Request): Promise<Response> {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
    }

    if (!process.env.API_KEY) {
        console.error('API Key not configured on the server.');
        return new Response(JSON.stringify({ error: 'Server configuration error.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    try {
        const { destinationCityName, lat, lon } = await req.json() as RequestBody;
        if (!destinationCityName) {
            return new Response(JSON.stringify({ error: 'Destination city name is required.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const systemInstruction = `You are a creative travel content generator. Your task is to act like a team of popular travel influencers. Based on the provided city, you will generate a list of 4 unique and interesting recommendations.

Rules:
- The recommendations should be diverse (e.g., a mix of restaurants, cool spots, attractions).
- Each recommendation must have a plausible but FAKE influencer name and a FAKE source URL (like a blog or social media post).
- The location of each recommendation should be reasonably close to the provided central coordinates.`;

        const contents = `Generate 4 influencer travel picks for the city of ${destinationCityName}, centered around latitude ${lat} and longitude ${lon}.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: contents,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });
        
        const picks: InfluencerPick[] = JSON.parse(response.text);

        return new Response(JSON.stringify(picks), { headers: { 'Content-Type': 'application/json' } });

    } catch (err) {
        console.error("Error in /api/influencer-picks handler:", err);
        const errorMessage = err instanceof Error ? err.message : 'An unexpected server error occurred.';
        return new Response(JSON.stringify({ error: errorMessage }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}