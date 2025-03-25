import { DataSourceProvider, DataSource, Field, ProcessedNode, Edge } from '../../types';

export class TransitiveFormDataSource implements DataSourceProvider {
    private nodes: ProcessedNode[];
    private edges: Edge[];

    constructor(nodes: ProcessedNode[], edges: Edge[]) {
        this.nodes = nodes;
        this.edges = edges;
    }

    getType(): string {
        return 'transitive';
    }

    getName(): string {
        return 'Transitive Dependencies';
    }

    async getAvailableSources(formId: string): Promise<DataSource[]> {
        // Find all upstream nodes
        const allUpstream = this.findAllUpstreamNodes(formId);

        // Find direct dependencies
        const directDependencies = this.edges
            .filter(edge => edge.target === formId)
            .map(edge => edge.source);

        // Filter out direct dependencies to get only transitive ones
        const transitiveDependencies = allUpstream.filter(id => !directDependencies.includes(id));

        // Convert to DataSource objects
        return transitiveDependencies.map(id => {
            const node = this.nodes.find(n => n.id === id);
            return {
                id,
                name: node?.name || id,
                type: 'form'
            };
        });
    }

    async getFieldsForSource(sourceId: string): Promise<Field[]> {
        const node = this.nodes.find(n => n.id === sourceId);
        return node?.fields || [];
    }

    private findAllUpstreamNodes(nodeId: string, visited = new Set<string>()): string[] {
        if (visited.has(nodeId)) return [];

        visited.add(nodeId);

        const directUpstream = this.edges
            .filter(edge => edge.target === nodeId)
            .map(edge => edge.source);

        const allUpstream: string[] = [...directUpstream];

        for (const upstreamId of directUpstream) {
            const transitiveUpstream = this.findAllUpstreamNodes(upstreamId, visited);
            allUpstream.push(...transitiveUpstream);
        }

        return allUpstream;
    }
}
