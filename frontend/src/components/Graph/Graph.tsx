import React, { useCallback } from 'react';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    Node as ReactFlowNode,
    Edge as ReactFlowEdge,
    Viewport
} from 'reactflow';
import 'reactflow/dist/style.css';
import { ProcessedNode, Edge } from '../../types';
import { FormNode } from './FormNode';

interface GraphProps {
    nodes: ProcessedNode[];
    edges: Edge[];
    onNodeClick: (node: ProcessedNode) => void;
}

// Define the node types
const nodeTypes = {
    form: FormNode,
};

// Define default viewport
const defaultViewport: Viewport = { x: 0, y: 0, zoom: 0.8 };

export const Graph: React.FC<GraphProps> = ({ nodes, edges, onNodeClick }) => {
    // Convert our nodes to ReactFlow nodes
    const initialNodes: ReactFlowNode[] = nodes.map(node => ({
        id: node.id,
        type: 'form',
        position: node.position,
        data: {
            ...node,
            onClick: () => onNodeClick(node)
        },
    }));

    // Convert our edges to ReactFlow edges with custom styling
    // Using bezier type edges as requested
    const initialEdges: ReactFlowEdge[] = edges.map(edge => ({
        id: `${edge.source}-${edge.target}`,
        source: edge.source,
        target: edge.target,
        type: 'bezier',
        animated: false,
        style: {
            stroke: '#d1d5db',
            strokeWidth: 2,
            opacity: 0.9,
            transition: 'stroke-width ease-in-out .2s',
        },
        // No arrow markers as per requirements
        className: 'custom-edge',
    }));

    // Use ReactFlow's state hooks
    const [reactFlowNodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [reactFlowEdges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    // Handle node click
    const handleNodeClick = useCallback((event: React.MouseEvent, node: ReactFlowNode) => {
        // Call the onNodeClick prop with the original node data
        const originalNode = nodes.find(n => n.id === node.id);
        if (originalNode) {
            onNodeClick(originalNode);
        }
    }, [nodes, onNodeClick]);

    return (
        <div className="diagram-container">
            <ReactFlow
                nodes={reactFlowNodes}
                edges={reactFlowEdges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={handleNodeClick}
                nodeTypes={nodeTypes}
                fitView
                minZoom={0.5}
                maxZoom={1.5}
                defaultViewport={defaultViewport}
                attributionPosition="bottom-right"
                style={{ backgroundColor: "#F7F9FB" }}
            >
                <Background
                    color="#d1d5db"
                    gap={20}
                    size={1}
                    variant="dots"
                    className="diagram-background"
                />
                <Controls />
                <MiniMap
                    nodeStrokeColor="#d1d5db"
                    nodeColor="#ffffff"
                    nodeBorderRadius={12}
                />
            </ReactFlow>
        </div>
    );
};
