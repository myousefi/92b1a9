import React from 'react';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    Node,
    Edge,
    NodeTypes
} from 'reactflow';
import 'reactflow/dist/style.css';
import { ProcessedNode } from '../../types';
import { FormNode } from './FormNode';

// Define custom node types
const nodeTypes: NodeTypes = {
    form: FormNode
};

interface GraphProps {
    nodes: ProcessedNode[];
    edges: any[];
    onNodeClick?: (node: ProcessedNode) => void;
}

export const Graph: React.FC<GraphProps> = ({ nodes, edges, onNodeClick }) => {
    // Convert our nodes to ReactFlow format
    const flowNodes: Node[] = nodes.map((node) => ({
        id: node.id,
        type: 'form',
        position: node.position,
        data: {
            ...node,
            onClick: () => onNodeClick && onNodeClick(node)
        }
    }));

    // Ensure all edges have unique IDs
    const flowEdges: Edge[] = edges.map((edge, index) => ({
        id: edge.id || `edge-${index}`,
        source: edge.source,
        target: edge.target,
        type: 'smoothstep',
        animated: false,
        style: { stroke: '#a0aec0', strokeWidth: 2 },
        ...edge
    }));

    return (
        <div className="graph-container">
            <ReactFlow
                nodes={flowNodes}
                edges={flowEdges}
                nodeTypes={nodeTypes}
                defaultEdgeOptions={{
                    type: 'smoothstep',
                    animated: false,
                }}
                fitView
                fitViewOptions={{ padding: 0.2 }}
                minZoom={0.5}
                maxZoom={2}
            >
                <Background color="#aaa" gap={16} />
                <Controls />
                <MiniMap
                    nodeStrokeColor="#aaa"
                    nodeColor="#fff"
                    nodeBorderRadius={8}
                />
            </ReactFlow>
        </div>
    );
};
