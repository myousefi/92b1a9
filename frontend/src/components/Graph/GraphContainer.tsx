import React, { useState } from 'react';
import { useGraphData } from '../../hooks/useGraphData';
import { Graph } from './Graph';
import { LoadingError } from '../common/LoadingError';
import { PrefillMappingModal } from '../Modals/PrefillMappingModal';
import { DataSourceSelectionModal } from '../Modals/DataSourceSelectionModal';
import { usePrefillMappings } from '../../hooks/usePrefillMappings';
import { ProcessedNode } from '../../types';

export const GraphContainer: React.FC = () => {
    const { data, loading, error } = useGraphData();
    const { prefillMappings, setMapping, clearMapping } = usePrefillMappings();

    const [selectedNode, setSelectedNode] = useState<ProcessedNode | null>(null);
    const [isPrefillModalOpen, setIsPrefillModalOpen] = useState(false);
    const [isDataSourceModalOpen, setIsDataSourceModalOpen] = useState(false);
    const [selectedFieldId, setSelectedFieldId] = useState<string>('');

    if (loading) {
        return <div className="loading">Loading graph data...</div>;
    }

    if (error) {
        return <LoadingError message="Failed to load graph data" error={error} />;
    }

    if (!data || !data.nodes || !data.edges || data.nodes.length === 0) {
        return <div className="error">No graph data available</div>;
    }

    const handleNodeClick = (node: ProcessedNode) => {
        setSelectedNode(node);
        setIsPrefillModalOpen(true);
    };

    const handleClosePrefillModal = () => {
        setIsPrefillModalOpen(false);
    };

    const handleEditMapping = (fieldId: string) => {
        setSelectedFieldId(fieldId);
        setIsDataSourceModalOpen(true);
    };

    const handleCloseDataSourceModal = () => {
        setIsDataSourceModalOpen(false);
    };

    const handleSelectDataSource = (
        sourceType: 'direct' | 'transitive' | 'global',
        sourceFormId: string | undefined,
        sourceFieldId: string
    ) => {
        setMapping(selectedFieldId, sourceType, sourceFormId, sourceFieldId);
    };

    return (
        <>
            <Graph
                nodes={data.nodes}
                edges={data.edges}
                onNodeClick={handleNodeClick}
            />

            <PrefillMappingModal
                node={selectedNode}
                isOpen={isPrefillModalOpen}
                onClose={handleClosePrefillModal}
                prefillMappings={prefillMappings}
                onEditMapping={handleEditMapping}
                onClearMapping={clearMapping}
            />

            <DataSourceSelectionModal
                isOpen={isDataSourceModalOpen}
                onClose={handleCloseDataSourceModal}
                currentNodeId={selectedNode?.id || ''}
                targetFieldId={selectedFieldId}
                onSelectDataSource={handleSelectDataSource}
                nodes={data.nodes}
                edges={data.edges}
            />
        </>
    );
};
