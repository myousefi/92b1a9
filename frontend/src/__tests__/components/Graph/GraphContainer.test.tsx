import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { GraphContainer } from '../../../components/Graph/GraphContainer';
import { useGraphData } from '../../../hooks/useGraphData';

// Mock the useGraphData hook
jest.mock('../../../hooks/useGraphData');

// Mock the Graph component
jest.mock('../../../components/Graph/Graph', () => ({
    Graph: ({ nodes, edges, onNodeClick }) => (
        <div data-testid="graph">
            <button
                data-testid="mock-node"
                onClick={() => onNodeClick && onNodeClick(nodes[0])}
            >
                Click Node
            </button>
        </div>
    ),
}));

// Mock the FormSidebar component
jest.mock('../../../components/Sidebar/FormSidebar', () => ({
    FormSidebar: ({ selectedNode, onClose }) => selectedNode ? (
        <div data-testid="sidebar">
            <div>{selectedNode.name}</div>
            <button onClick={onClose}>Close</button>
        </div>
    ) : null,
}));

describe('GraphContainer Component', () => {
    const mockData = {
        nodes: [
            { id: 'node1', name: 'Form A', fields: [], position: { x: 100, y: 100 } },
            { id: 'node2', name: 'Form B', fields: [], position: { x: 300, y: 100 } },
        ],
        edges: [{ source: 'node1', target: 'node2' }],
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders loading state', () => {
        (useGraphData as jest.Mock).mockReturnValue({
            data: null,
            loading: true,
            error: null,
        });

        render(<GraphContainer />);
        expect(screen.getByText('Loading graph data...')).toBeInTheDocument();
    });

    it('renders error state', () => {
        const mockError = new Error('Test error');
        (useGraphData as jest.Mock).mockReturnValue({
            data: null,
            loading: false,
            error: mockError,
        });

        render(<GraphContainer />);
        expect(screen.getByText('Failed to load graph data')).toBeInTheDocument();
    });

    it('renders graph when data is available', () => {
        (useGraphData as jest.Mock).mockReturnValue({
            data: mockData,
            loading: false,
            error: null,
        });

        render(<GraphContainer />);
        expect(screen.getByTestId('graph')).toBeInTheDocument();
    });

    it('shows sidebar when a node is clicked', () => {
        (useGraphData as jest.Mock).mockReturnValue({
            data: mockData,
            loading: false,
            error: null,
        });

        render(<GraphContainer />);

        // Initially, sidebar should not be visible
        expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument();

        // Click a node
        fireEvent.click(screen.getByTestId('mock-node'));

        // Sidebar should now be visible
        expect(screen.getByTestId('sidebar')).toBeInTheDocument();
        expect(screen.getByText('Form A')).toBeInTheDocument();
    });

    it('hides sidebar when close button is clicked', () => {
        (useGraphData as jest.Mock).mockReturnValue({
            data: mockData,
            loading: false,
            error: null,
        });

        render(<GraphContainer />);

        // Click a node to show sidebar
        fireEvent.click(screen.getByTestId('mock-node'));
        expect(screen.getByTestId('sidebar')).toBeInTheDocument();

        // Click close button
        fireEvent.click(screen.getByText('Close'));

        // Sidebar should be hidden
        expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument();
    });

    it('renders error message when no graph data is available', () => {
        (useGraphData as jest.Mock).mockReturnValue({
            data: { nodes: [], edges: [] },
            loading: false,
            error: null,
        });

        render(<GraphContainer />);
        expect(screen.getByText('No graph data available')).toBeInTheDocument();
    });
});
