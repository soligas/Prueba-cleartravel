
import { GoogleGenAI, Type } from "@google/genai";
import type { CulinaryGem, Coordinates } from '../types';

interface RequestBody {
    coordinates: Coordinates;
    destinationCityName: string;
}

const responseSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            name: { type: Type.STRING, description: "The name of the restaurant or food stall." },
            description: { type: Type.STRING, description: "A short, enticing description of why this place is a cultural gem and what to try." },
            cuisineType: { type: Type.STRING, description: "The primary type of cuisine (e.g., 'Traditional Japanese', 'Street Tacos', 'Neapolitan Pizza')." },
            address: { type: Type.STRING, description: "The approximate street address of the location." },
            latitude: { type: Type.NUMBER, description: "The latitude coordinate." },
            longitude: { type: Type.NUMBER, description: "The longitude coordinate." },
        },
        required: ["name", "description", "cuisineType", "address", "latitude", "longitude"],
    },
};

export default async function handler(req: Request): Promise<Response> {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
    }
    
    if (!process.env.API_KEY) {
        console.error('API Key not configured on the server.');
        return new Response(JSON.stringify({ error: 'Server configuration error.' }), { status: 500 });
    }

    try {
        const { coordinates, destinationCityName } = await req.json() as RequestBody;
        if (!coordinates || !destinationCityName) {
            return new Response(JSON.stringify({ error: 'Coordinates and destination city name are required.' }), { status: 400 });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const systemInstruction = `You are a "Cultural Food Scout" AI. Your mission is to find authentic, delicious, and affordable food experiences that capture the soul of a city. You ignore tourist traps and focus on places loved by locals.

        Rules:
        1.  Generate a list of 3-4 unique culinary recommendations.
        2.  Each recommendation must be a real or highly plausible type of establishment for the given city.
        3.  The location (latitude/longitude) must be plausibly scattered around the provided central coordinates, within a reasonable distance (e.g., 1-5km).
        4.  The descriptions should be short, vivid, and highlight the cultural significance or a must-try dish.`;

        const contents = `Generate culinary gems for ${destinationCityName} near latitude ${coordinates.lat}, longitude ${coordinates.lon}.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema,
            },
        });
        
        const gems: CulinaryGem[] = JSON.parse(response.text);
        return new Response(JSON.stringify(gems), { headers: { 'Content-Type': 'application/json' } });

    } catch (err) {
        console.error("Error in /api/culinary-gems handler:", err);
        const errorMessage = err instanceof Error ? err.message : 'An unexpected server error occurred.';
        return new Response(JSON.stringify({ error: errorMessage }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
