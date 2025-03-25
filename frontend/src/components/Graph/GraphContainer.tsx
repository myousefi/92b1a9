import React, { useState } from 'react';
import { useGraphData } from '../../hooks/useGraphData';
import { Graph } from './Graph';
import { LoadingError } from '../common/LoadingError';
import { FormSidebar } from '../Sidebar/FormSidebar';
import { ProcessedNode } from '../../types';

export const GraphContainer: React.FC = () => {
    const { data, loading, error } = useGraphData();
    const [selectedNode, setSelectedNode] = useState<ProcessedNode | null>(null);

    const handleNodeClick = (node: ProcessedNode) => {
        setSelectedNode(node);
    };

    const handleCloseSidebar = () => {
        setSelectedNode(null);
    };

    if (loading) {
        return <div className="loading">Loading graph data...</div>;
    }

    if (error) {
        return <div className="error">Failed to load graph data: {error.message}</div>;
    }

    if (!data || !data.nodes || !data.edges || data.nodes.length === 0) {
        return <div className="error">No graph data available</div>;
    }

    return (
        <div className="graph-container">
            <Graph
                nodes={data.nodes}
                edges={data.edges}
                onNodeClick={handleNodeClick}
            />

            <FormSidebar
                selectedNode={selectedNode}
                onClose={handleCloseSidebar}
            />
        </div>
    );
};
