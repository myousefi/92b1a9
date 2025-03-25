const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

/**
   * Generic API GET helper
   */
export async function apiGet<T>(path: string): Promise<T> {
    const url = `${API_URL}${path}`;
    console.log('Fetching from URL:', url);

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

/**
   * Returns the URL for the blueprint graph endpoint that matches the working curl example
   */
export function getBlueprintGraphUrl(): string {
    return '/api/v1/frontendchallengeserver/actions/blueprints/bp_01jk766tckfwx84xjcxazggzyc/graph';
}
