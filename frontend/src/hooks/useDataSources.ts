import { useCallback, useMemo, useState, useEffect } from 'react';
import { DataSource, Field, ProcessedNode, Edge } from '../types';
import { dataSourceRegistry } from '../services/dataSources/DataSourceRegistry';
import { DirectFormDataSource } from '../services/dataSources/DirectFormDataSource';
import { TransitiveFormDataSource } from '../services/dataSources/TransitiveFormDataSource';
import { GlobalDataSource } from '../services/dataSources/GlobalDataSource';

export function useDataSources(
    currentNodeId: string,
    nodes: ProcessedNode[],
    edges: Edge[]
) {
    const [directSources, setDirectSources] = useState<DataSource[]>([]);
    const [transitiveSources, setTransitiveSources] = useState<DataSource[]>([]);
    const [globalSources, setGlobalSources] = useState<DataSource[]>([]);

    // Initialize data source providers
    useEffect(() => {
        // Clear existing providers
        while (dataSourceRegistry.getProviders().length > 0) {
            dataSourceRegistry.getProviders().pop();
        }

        // Register providers
        dataSourceRegistry.registerProvider(new DirectFormDataSource(nodes, edges));
        dataSourceRegistry.registerProvider(new TransitiveFormDataSource(nodes, edges));
        dataSourceRegistry.registerProvider(new GlobalDataSource());

        // Load sources for each type
        const loadSources = async () => {
            const directProvider = dataSourceRegistry.getProviderByType('direct');
            const transitiveProvider = dataSourceRegistry.getProviderByType('transitive');
            const globalProvider = dataSourceRegistry.getProviderByType('global');

            if (directProvider) {
                setDirectSources(await directProvider.getAvailableSources(currentNodeId));
            }

            if (transitiveProvider) {
                setTransitiveSources(await transitiveProvider.getAvailableSources(currentNodeId));
            }

            if (globalProvider) {
                setGlobalSources(await globalProvider.getAvailableSources(currentNodeId));
            }
        };

        if (currentNodeId) {
            loadSources();
        }
    }, [currentNodeId, nodes, edges]);

    // Get fields for a specific source
    const getFieldsForSource = useCallback(async (sourceId: string): Promise<Field[]> => {
        // Determine which provider to use based on the source ID
        let provider;

        if (sourceId.startsWith('global_')) {
            provider = dataSourceRegistry.getProviderByType('global');
        } else {
            // Check if it's a direct or transitive source
            const isDirectSource = directSources.some(s => s.id === sourceId);
            provider = dataSourceRegistry.getProviderByType(isDirectSource ? 'direct' : 'transitive');
        }

        if (provider) {
            return provider.getFieldsForSource(sourceId);
        }

        return [];
    }, [directSources]);

    return {
        directSources,
        transitiveSources,
        globalSources,
        getFieldsForSource
    };
}
