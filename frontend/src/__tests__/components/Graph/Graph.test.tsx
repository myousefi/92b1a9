import React from 'react';
import { render, screen } from '@testing-library/react';
import { Graph } from '../../../components/Graph/Graph';

// Mock ReactFlow
jest.mock('reactflow', () => ({
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="react-flow">
            {children}
        </div>
    ),
    Background: () => <div data-testid="background" />,
    Controls: () => <div data-testid="controls" />,
    MiniMap: () => <div data-testid="minimap" />,
    ConnectionLineType: {
        SmoothStep: 'smoothstep',
        Bezier: 'bezier',
        Straight: 'straight'
    }
}));

describe('Graph Component', () => {
    const mockNodes = [
        {
            id: 'node1',
            name: 'Form A',
            fields: [],
            position: { x: 100, y: 100 }
        },
        {
            id: 'node2',
            name: 'Form B',
            fields: [],
            position: { x: 300, y: 100 }
        }
    ];

    const mockEdges = [
        {
            source: 'node1',
            target: 'node2'
        }
    ];

    const mockOnNodeClick = jest.fn();

    it('renders the ReactFlow component', () => {
        render(
            <Graph
                nodes={mockNodes}
                edges={mockEdges}
                onNodeClick={mockOnNodeClick}
            />
        );

        expect(screen.getByTestId('react-flow')).toBeInTheDocument();
    });

    it('renders background, controls, and minimap', () => {
        render(
            <Graph
                nodes={mockNodes}
                edges={mockEdges}
                onNodeClick={mockOnNodeClick}
            />
        );

        expect(screen.getByTestId('background')).toBeInTheDocument();
        expect(screen.getByTestId('controls')).toBeInTheDocument();
        expect(screen.getByTestId('minimap')).toBeInTheDocument();
    });
});
