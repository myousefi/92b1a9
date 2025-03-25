import React from 'react';
import { useGraphData } from '../../hooks/useGraphData';
import { Graph } from './Graph';
import { LoadingError } from '../common/LoadingError';

export const GraphContainer: React.FC = () => {
    const { data, loading, error } = useGraphData();

    if (loading) {
        return <div className="loading">Loading graph data...</div>;
    }

    if (error) {
        return <LoadingError message="Failed to load graph data" error={error} />;
    }

    if (!data || !data.nodes || !data.edges || data.nodes.length === 0) {
        return <div className="error">No graph data available</div>;
    }

    return <Graph nodes={data.nodes} edges={data.edges} />;
};
