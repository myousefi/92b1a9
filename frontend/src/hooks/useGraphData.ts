import { useState, useEffect } from 'react';
import { GraphResponse } from '../types';
import { fetchGraphData } from '../services/api/graphService';

interface GraphDataState {
    data: GraphResponse | null;
    loading: boolean;
    error: Error | null;
}

/**
 * Custom hook to fetch and manage graph data
 */
export function useGraphData(): GraphDataState {
    const [state, setState] = useState<GraphDataState>({
        data: null,
        loading: true,
        error: null,
    });

    useEffect(() => {
        let isMounted = true;

        async function loadData() {
            try {
                const data = await fetchGraphData();

                if (isMounted) {
                    setState({
                        data,
                        loading: false,
                        error: null,
                    });
                }
            } catch (error) {
                if (isMounted) {
                    setState({
                        data: null,
                        loading: false,
                        error: error instanceof Error ? error : new Error('Unknown error'),
                    });
                }
            }
        }

        loadData();

        // Cleanup function to prevent state updates if the component unmounts
        return () => {
            isMounted = false;
        };
    }, []);

    return state;
}
