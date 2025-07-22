

import type { Currency } from '../types';

export async function* getTravelDataStream(query: string, currency: Currency): AsyncGenerator<{ type: 'data' | 'tip' | 'error' | 'cost_summary'; payload: any }> {
    try {
        const response = await fetch('/api/travel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query, currency }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            yield { type: 'error', payload: errorData.payload || `Request failed with status ${response.status}` };
            return;
        }

        if (!response.body) {
            yield { type: 'error', payload: 'The response body is empty.' };
            return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                if (buffer.trim()) {
                    try {
                        yield JSON.parse(buffer);
                    } catch (e) {
                        console.error("Failed to parse final buffer chunk:", e, "Content:", buffer);
                        yield { type: 'error', payload: 'Error parsing final data chunk.' };
                    }
                }
                break;
            }

            buffer += decoder.decode(value, { stream: true });
            
            const lines = buffer.split('\n');
            buffer = lines.pop() || ''; // Keep the last, possibly incomplete line

            for (const line of lines) {
                if (line.trim()) {
                    try {
                        yield JSON.parse(line);
                    } catch (e) {
                        console.error("Failed to parse stream line:", e, "Content:", line);
                    }
                }
            }
        }
    } catch (err) {
        console.error("Error during fetch stream:", err);
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred while fetching data.';
        yield { type: 'error', payload: errorMessage };
    }
}