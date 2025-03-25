import { DataSourceProvider, DataSource, Field, ProcessedNode, Edge } from '../../types';

export class DirectFormDataSource implements DataSourceProvider {
    private nodes: ProcessedNode[];
    private edges: Edge[];

    constructor(nodes: ProcessedNode[], edges: Edge[]) {
        this.nodes = nodes;
        this.edges = edges;
    }

    getType(): string {
        return 'direct';
    }

    getName(): string {
        return 'Direct Dependencies';
    }

    async getAvailableSources(formId: string): Promise<DataSource[]> {
        // Find direct dependencies (forms that directly connect to the current form)
        const directDependencies = this.edges
            .filter(edge => edge.target === formId)
            .map(edge => edge.source);

        // Convert to DataSource objects
        return directDependencies.map(id => {
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
}
