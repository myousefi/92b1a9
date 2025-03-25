import { DataSource, Field } from '../../types';
import { fetchGraphData } from '../../services/api/graphService';

/**
   * Gets direct dependencies for a form
   * @param formId The ID of the form to get dependencies for
   * @returns Promise with an array of data sources
   */
export async function getDirectDependencies(formId: string): Promise<DataSource[]> {
    try {
        // Fetch the graph data
        const graphData = await fetchGraphData();

        // Find direct dependencies (forms that have edges pointing to this form)
        const directDependencies: DataSource[] = [];

        graphData.edges.forEach(edge => {
            if (edge.target === formId) {
                // Find the source node
                const sourceNode = graphData.nodes.find(node => node.id === edge.source);
                if (sourceNode) {
                    directDependencies.push({
                        id: sourceNode.id,
                        name: sourceNode.name,
                        type: 'form'
                    });
                }
            }
        });

        return directDependencies;
    } catch (error) {
        console.error('Error getting direct dependencies:', error);
        return [];
    }
}

/**
   * Gets transitive dependencies for a form (indirect dependencies)
   * @param formId The ID of the form to get dependencies for
   * @returns Promise with an array of data sources
   */
export async function getTransitiveDependencies(formId: string): Promise<DataSource[]> {
    try {
        // Fetch the graph data
        const graphData = await fetchGraphData();

        // Get direct dependencies first
        const directDeps = await getDirectDependencies(formId);
        const directDepIds = new Set(directDeps.map(dep => dep.id));

        // Find all upstream forms recursively
        const allDependencies = new Set<string>();
        const visited = new Set<string>();

        function findUpstreamForms(nodeId: string) {
            if (visited.has(nodeId)) return;
            visited.add(nodeId);

            graphData.edges.forEach(edge => {
                if (edge.target === nodeId) {
                    allDependencies.add(edge.source);
                    findUpstreamForms(edge.source);
                }
            });
        }

        // Start with the direct dependencies
        directDepIds.forEach(depId => {
            findUpstreamForms(depId);
        });

        // Remove direct dependencies to get only transitive ones
        const transitiveDepIds = [...allDependencies].filter(id => !directDepIds.has(id));

        // Convert IDs to DataSource objects
        const transitiveDependencies: DataSource[] = transitiveDepIds.map(id => {
            const node = graphData.nodes.find(node => node.id === id);
            return {
                id,
                name: node?.name || id,
                type: 'form'
            };
        });

        return transitiveDependencies;
    } catch (error) {
        console.error('Error getting transitive dependencies:', error);
        return [];
    }
}
