
import { GoogleGenAI } from "@google/genai";

interface InspireRequest {
    tripType: string;
    region: string;
    budget: string;
    currentCity: string; // To have a realistic origin
}

export default async function handler(req: Request): Promise<Response> {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
    }

    if (!process.env.API_KEY) {
        console.error('API Key not configured on the server.');
        return new Response(JSON.stringify({ error: 'Server configuration error.' }), { status: 500 });
    }

    try {
        const { tripType, region, budget, currentCity } = await req.json() as InspireRequest;
        if (!tripType || !region || !budget) {
            return new Response(JSON.stringify({ error: 'Missing required inspiration parameters.' }), { status: 400 });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const systemInstruction = `You are an imaginative travel expert who suggests exciting and specific trip ideas. Your task is to generate a single, complete search query for a travel planner app.

Rules:
1. The output must be ONLY the search query string, nothing else. No preamble, no explanation.
2. The query must be specific and sound natural, like a human would type it.
3. The query should include a flight from a given origin city to a destination, and a hotel request.
4. The destination should fit the user's preferences for trip type, region, and budget.
5. Budget mapping: '$' is budget-friendly, '$$' is mid-range, '$$$' is luxury.
6. Make the trip duration and time of year plausible and interesting (e.g., 'for a week in May', 'for 10 days over New Year's').
7. The origin city will be provided. The destination must be different.
8. Example output: "Find cheap flights from San Francisco to Lisbon and a boutique hotel for a week in September"`;

        const contents = `Generate a travel search query based on these preferences:
- Origin City: ${currentCity || 'New York'}
- Trip Type: ${tripType}
- Region: ${region}
- Budget: ${budget}`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: contents,
            config: {
                systemInstruction: systemInstruction,
            },
        });
        
        const queryText = response.text.trim().replace(/["']/g, ''); // Clean up quotes

        return new Response(JSON.stringify({ query: queryText }), { headers: { 'Content-Type': 'application/json' } });

    } catch (err) {
        console.error("Error in /api/inspire handler:", err);
        const errorMessage = err instanceof Error ? err.message : 'An unexpected server error occurred.';
        return new Response(JSON.stringify({ error: errorMessage }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
