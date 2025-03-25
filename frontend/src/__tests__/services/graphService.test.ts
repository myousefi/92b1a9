import { fetchGraphData } from '../../services/api/graphService';
import { apiGet } from '../../services/api/apiClient';

// Mock the apiClient module
jest.mock('../../services/api/apiClient', () => ({
    apiGet: jest.fn(),
    getBlueprintGraphUrl: jest.fn().mockReturnValue('/test-url')
}));

describe('Graph Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('calls apiGet with the correct URL', async () => {
        // Mock a successful response
        (apiGet as jest.Mock).mockResolvedValueOnce({
            nodes: [],
            edges: [],
            forms: []
        });

        try {
            // Call the function
            await fetchGraphData();

            // Check that apiGet was called
            expect(apiGet).toHaveBeenCalled();
        } catch (error) {
            fail('fetchGraphData should not throw an error');
        }
    });
});
