import { renderHook, act } from '@testing-library/react';
import { useGraphData } from '../../hooks/useGraphData';
import { fetchGraphData } from '../../services/api/graphService';
import { GraphResponse } from '../../types';

// Mock the graphService
jest.mock('../../services/api/graphService');

describe('useGraphData', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    it('should start with loading state', () => {
        const { result } = renderHook(() => useGraphData());

        expect(result.current.loading).toBe(true);
        expect(result.current.data).toBeNull();
        expect(result.current.error).toBeNull();
    });

    it('should fetch data and update state', async () => {
        // Mock data
        const mockGraphData: GraphResponse = {
            nodes: [{ id: 'form1', name: 'Form 1', fields: [] }],
            edges: [{ source: 'form1', target: 'form2' }],
        };

        // Mock the fetchGraphData function
        (fetchGraphData as jest.Mock).mockResolvedValueOnce(mockGraphData);

        // Use a promise to control when the mock resolves
        let resolvePromise: (value: unknown) => void;
        const promise = new Promise((resolve) => {
            resolvePromise = resolve;
        });

        // Render the hook
        const { result } = renderHook(() => useGraphData());

        // Initial state should be loading
        expect(result.current.loading).toBe(true);

        // Resolve the promise to trigger the state update
        await act(async () => {
            resolvePromise!(null);
            await promise;
        });

        // Check the final state
        expect(result.current.loading).toBe(false);
        expect(result.current.data).toEqual(mockGraphData);
        expect(result.current.error).toBeNull();
        expect(fetchGraphData).toHaveBeenCalledTimes(1);
    });

    it('should handle errors', async () => {
        // Mock an error
        const mockError = new Error('Failed to fetch');
        (fetchGraphData as jest.Mock).mockRejectedValueOnce(mockError);

        // Use a promise to control when the mock rejects
        let rejectPromise: (reason?: any) => void;
        const promise = new Promise((_, reject) => {
            rejectPromise = reject;
        });

        // Render the hook
        const { result } = renderHook(() => useGraphData());

        // Initial state should be loading
        expect(result.current.loading).toBe(true);

        // Reject the promise to trigger the state update
        await act(async () => {
            try {
                rejectPromise!(mockError);
                await promise;
            } catch (e) {
                // Expected rejection
            }
        });

        // Check the final state
        expect(result.current.loading).toBe(false);
        expect(result.current.data).toBeNull();
        expect(result.current.error).toEqual(mockError);
        expect(fetchGraphData).toHaveBeenCalledTimes(1);
    });
});
