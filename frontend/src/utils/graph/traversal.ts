import { ProcessedNode, Edge } from '../../types';

/**
 * Finds all direct dependencies of a node (forms that directly feed into this form)
 * @param nodeId The ID of the node to find dependencies for
 * @param nodes All nodes in the graph
 * @param edges All edges in the graph
 * @returns Array of nodes that are direct dependencies
 */
export function findDirectDependencies(
    nodeId: string,
    nodes: ProcessedNode[],
    edges: Edge[]
): ProcessedNode[] {
    // Find all edges where this node is the target
    const incomingEdges = edges.filter(edge => edge.target === nodeId);

    // Get the source node IDs from these edges
    const sourceNodeIds = incomingEdges.map(edge => edge.source);

    // Find the actual nodes from the node IDs
    return nodes.filter(node => sourceNodeIds.includes(node.id));
}

/**
 * Finds all transitive dependencies of a node (forms that indirectly feed into this form)
 * @param nodeId The ID of the node to find dependencies for
 * @param nodes All nodes in the graph
 * @param edges All edges in the graph
 * @returns Array of nodes that are transitive dependencies
 */
export function findTransitiveDependencies(
    nodeId: string,
    nodes: ProcessedNode[],
    edges: Edge[]
): ProcessedNode[] {
    // Get direct dependencies
    const directDeps = findDirectDependencies(nodeId, nodes, edges);
    const directDepIds = directDeps.map(node => node.id);

    // Initialize result with empty array
    const transitiveDeps: ProcessedNode[] = [];

    // For each direct dependency, find its dependencies recursively
    directDepIds.forEach(depId => {
        const ancestors = findAllAncestors(depId, nodes, edges);

        // Add ancestors to the result if they're not already included
        ancestors.forEach(ancestor => {
            if (!transitiveDeps.some(dep => dep.id === ancestor.id) &&
                !directDepIds.includes(ancestor.id)) {
                transitiveDeps.push(ancestor);
            }
        });
    });

    return transitiveDeps;
}

/**
 * Recursively finds all ancestors (dependencies) of a node
 * @param nodeId The ID of the node to find ancestors for
 * @param nodes All nodes in the graph
 * @param edges All edges in the graph
 * @param visited Set of already visited node IDs (to prevent cycles)
 * @returns Array of all ancestor nodes
 */
function findAllAncestors(
    nodeId: string,
    nodes: ProcessedNode[],
    edges: Edge[],
    visited: Set<string> = new Set()
): ProcessedNode[] {
    // Mark this node as visited
    visited.add(nodeId);

    // Find direct dependencies
    const directDeps = findDirectDependencies(nodeId, nodes, edges);
    const result: ProcessedNode[] = [...directDeps];

    // For each direct dependency, find its ancestors recursively
    directDeps.forEach(dep => {
        if (!visited.has(dep.id)) {
            const ancestors = findAllAncestors(dep.id, nodes, edges, visited);

            // Add ancestors to the result if they're not already included
            ancestors.forEach(ancestor => {
                if (!result.some(node => node.id === ancestor.id)) {
                    result.push(ancestor);
                }
            });
        }
    });

    return result;
}

/**
 * Creates a cache key for dependency lookups
 */
function createCacheKey(nodeId: string, type: 'direct' | 'transitive'): string {
    return `${type}_${nodeId}`;
}

// Cache for dependency lookups
const dependencyCache = new Map<string, ProcessedNode[]>();

/**
 * Clears the dependency cache
 */
export function clearDependencyCache(): void {
    dependencyCache.clear();
}

/**
 * Gets direct dependencies with caching
 */
export function getDirectDependencies(
    nodeId: string,
    nodes: ProcessedNode[],
    edges: Edge[]
): ProcessedNode[] {
    const cacheKey = createCacheKey(nodeId, 'direct');

    if (!dependencyCache.has(cacheKey)) {
        const dependencies = findDirectDependencies(nodeId, nodes, edges);
        dependencyCache.set(cacheKey, dependencies);
    }

    return dependencyCache.get(cacheKey) || [];
}

/**
 * Gets transitive dependencies with caching
 */
export function getTransitiveDependencies(
    nodeId: string,
    nodes: ProcessedNode[],
    edges: Edge[]
): ProcessedNode[] {
    const cacheKey = createCacheKey(nodeId, 'transitive');

    if (!dependencyCache.has(cacheKey)) {
        const dependencies = findTransitiveDependencies(nodeId, nodes, edges);
        dependencyCache.set(cacheKey, dependencies);
    }

    return dependencyCache.get(cacheKey) || [];
}
