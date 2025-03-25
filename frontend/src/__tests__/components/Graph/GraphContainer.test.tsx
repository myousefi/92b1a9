import React from 'react';
import { render, screen } from '@testing-library/react';
import { GraphContainer } from '../../../components/Graph/GraphContainer';
import { useGraphData } from '../../../hooks/useGraphData';
import { LoadingError } from '../../../components/common/LoadingError';

// Mock the useGraphData hook
jest.mock('../../../hooks/useGraphData');

// Mock the Graph component
jest.mock('../../../components/Graph/Graph', () => ({
    Graph: () => <div data-testid="graph" />,
}));

// Mock the LoadingError component
jest.mock('../../../components/common/LoadingError', () => ({
    LoadingError: ({ message, error }: { message: string; error: Error }) => (
        <div className="error-container">
            <h3>{message}</h3>
            <p className="error-details">{error.message}</p>
        </div>
    ),
}));

describe('GraphContainer Component', () => {
    it('shows loading state', () => {
        (useGraphData as jest.Mock).mockReturnValue({
            data: null,
            loading: true,
            error: null,
        });

        render(<GraphContainer />);
        expect(screen.getByText(/loading graph data/i)).toBeInTheDocument();
    });

    it('shows error state', () => {
        const mockError = new Error('Test error');
        (useGraphData as jest.Mock).mockReturnValue({
            data: null,
            loading: false,
            error: mockError,
        });

        render(<GraphContainer />);
        expect(screen.getByText('Failed to load graph data')).toBeInTheDocument();
        expect(screen.getByText('Test error')).toBeInTheDocument();
    });

    it('shows no data message when data is empty', () => {
        (useGraphData as jest.Mock).mockReturnValue({
            data: { nodes: [], edges: [] },
            loading: false,
            error: null,
        });

        render(<GraphContainer />);
        expect(screen.getByText('No graph data available')).toBeInTheDocument();
    });

    it('renders the Graph component when data is available', () => {
        const mockData = {
            nodes: [{ id: 'node1', name: 'Form A', fields: [], position: { x: 0, y: 0 } }],
            edges: [{ id: 'edge1', source: 'node1', target: 'node2' }],
        };

        (useGraphData as jest.Mock).mockReturnValue({
            data: mockData,
            loading: false,
            error: null,
        });

        render(<GraphContainer />);
        expect(screen.getByTestId('graph')).toBeInTheDocument();
    });
});
