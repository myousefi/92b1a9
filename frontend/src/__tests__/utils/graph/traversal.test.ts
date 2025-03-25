import {
    findDirectDependencies,
    findTransitiveDependencies,
    getDirectDependencies,
    getTransitiveDependencies,
    clearDependencyCache
} from '../../../utils/graph/traversal';
import { ProcessedNode, Edge } from '../../../types';

describe('Graph Traversal Utilities', () => {
    // Test data
    const nodes: ProcessedNode[] = [
        { id: 'A', name: 'Form A', fields: [], position: { x: 0, y: 0 } },
        { id: 'B', name: 'Form B', fields: [], position: { x: 0, y: 0 } },
        { id: 'C', name: 'Form C', fields: [], position: { x: 0, y: 0 } },
        { id: 'D', name: 'Form D', fields: [], position: { x: 0, y: 0 } },
        { id: 'E', name: 'Form E', fields: [], position: { x: 0, y: 0 } },
    ];

    // A -> B -> D
    // A -> C -> D
    // E (no connections)
    const edges: Edge[] = [
        { source: 'A', target: 'B' },
        { source: 'A', target: 'C' },
        { source: 'B', target: 'D' },
        { source: 'C', target: 'D' },
    ];

    beforeEach(() => {
        clearDependencyCache();
    });

    describe('findDirectDependencies', () => {
        it('finds direct dependencies correctly', () => {
            const depsOfD = findDirectDependencies('D', nodes, edges);
            expect(depsOfD).toHaveLength(2);
            expect(depsOfD.map(node => node.id).sort()).toEqual(['B', 'C']);

            const depsOfB = findDirectDependencies('B', nodes, edges);
            expect(depsOfB).toHaveLength(1);
            expect(depsOfB[0].id).toBe('A');

            const depsOfA = findDirectDependencies('A', nodes, edges);
            expect(depsOfA).toHaveLength(0);

            const depsOfE = findDirectDependencies('E', nodes, edges);
            expect(depsOfE).toHaveLength(0);
        });
    });

    describe('findTransitiveDependencies', () => {
        it('finds transitive dependencies correctly', () => {
            const transOfD = findTransitiveDependencies('D', nodes, edges);
            expect(transOfD).toHaveLength(1);
            expect(transOfD[0].id).toBe('A');

            const transOfB = findTransitiveDependencies('B', nodes, edges);
            expect(transOfB).toHaveLength(0);

            const transOfC = findTransitiveDependencies('C', nodes, edges);
            expect(transOfC).toHaveLength(0);

            const transOfA = findTransitiveDependencies('A', nodes, edges);
            expect(transOfA).toHaveLength(0);
        });

        it('handles cycles in the graph', () => {
            // Create a cycle: D -> A
            const edgesWithCycle = [...edges, { source: 'D', target: 'A' }];

            const transOfD = findTransitiveDependencies('D', nodes, edgesWithCycle);
            expect(transOfD.length).toBeGreaterThan(0); // Should not hang or crash
        });
    });

    describe('Cached dependency functions', () => {
        it('caches direct dependencies', () => {
            // First call should compute and cache
            const depsOfD1 = getDirectDependencies('D', nodes, edges);
            expect(depsOfD1).toHaveLength(2);

            // Modify the edges (this shouldn't affect the cached result)
            const modifiedEdges = edges.filter(edge => edge.source !== 'C');

            // Second call should use cache
            const depsOfD2 = getDirectDependencies('D', nodes, modifiedEdges);
            expect(depsOfD2).toHaveLength(2); // Still 2, not 1

            // Clear cache and try again
            clearDependencyCache();
            const depsOfD3 = getDirectDependencies('D', nodes, modifiedEdges);
            expect(depsOfD3).toHaveLength(1); // Now 1 after cache clear
        });

        it('caches transitive dependencies', () => {
            // First call should compute and cache
            const transOfD1 = getTransitiveDependencies('D', nodes, edges);
            expect(transOfD1).toHaveLength(1);

            // Modify the nodes (this shouldn't affect the cached result)
            const modifiedNodes = nodes.filter(node => node.id !== 'A');

            // Second call should use cache
            const transOfD2 = getTransitiveDependencies('D', modifiedNodes, edges);
            expect(transOfD2).toHaveLength(1); // Still 1, not 0

            // Clear cache and try again
            clearDependencyCache();
            const transOfD3 = getTransitiveDependencies('D', modifiedNodes, edges);
            expect(transOfD3).toHaveLength(0); // Now 0 after cache clear
        });
    });
});
