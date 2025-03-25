import React, { useState } from 'react';
import { useGraphData } from '../../hooks/useGraphData';
import { Graph } from './Graph';
import { LoadingError } from '../common/LoadingError';
import { FormSidebar } from '../Modals/FormModal';
import { ProcessedNode } from '../../types';

export const GraphContainer: React.FC = () => {
    const { data, loading, error } = useGraphData();
    const [selectedNode, setSelectedNode] = useState<ProcessedNode | null>(null);

    const handleNodeClick = (node: ProcessedNode) => {
        console.log('Node clicked:', node); // Add this for debugging
        setSelectedNode(node);
    };

    const handleCloseSidebar = () => {
        console.log('Closing sidebar'); // Add this for debugging
        setSelectedNode(null);
    };

    return (
        <LoadingError loading={loading} error={error}>
            {data && data.nodes && data.edges && data.nodes.length > 0 ? (
                <div className="graph-container-wrapper">
                    <Graph
                        nodes={data.nodes}
                        edges={data.edges}
                        onNodeClick={handleNodeClick}
                    />
                    {selectedNode && (
                        <FormSidebar
                            selectedNode={selectedNode}
                            onClose={handleCloseSidebar}
                        />
                    )}
                </div>
            ) : (
                <div className="error">No graph data available</div>
            )}
        </LoadingError>
    );
};
