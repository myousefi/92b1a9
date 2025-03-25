import { fetchGraphData } from '../../services/api/graphService';

// Skip these tests in CI environments or when running unit tests
const runIntegrationTests = process.env.RUN_INTEGRATION_TESTS === 'true';
const testMethod = runIntegrationTests ? it : it.skip;

describe('Graph API Integration', () => {
    // This test will only run when explicitly enabled
    testMethod('fetches real data from the API endpoint', async () => {
        // This test will actually hit the real API
        const result = await fetchGraphData();

        // Basic validation of the response
        expect(result).toBeDefined();
        expect(Array.isArray(result.nodes)).toBe(true);
        expect(Array.isArray(result.edges)).toBe(true);

        // Check that we got some data
        expect(result.nodes.length).toBeGreaterThan(0);

        // Check that the first node has the expected structure
        const firstNode = result.nodes[0];
        expect(firstNode).toHaveProperty('id');
        expect(firstNode).toHaveProperty('name');
        expect(firstNode).toHaveProperty('fields');
        expect(firstNode).toHaveProperty('position');

        // Check that the position has x and y coordinates
        expect(firstNode.position).toHaveProperty('x');
        expect(firstNode.position).toHaveProperty('y');
    }, 10000); // Increase timeout for API call
});
