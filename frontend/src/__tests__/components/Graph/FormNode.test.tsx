import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormNode } from '../../../components/Graph/FormNode';

// Mock the Handle component from ReactFlow
jest.mock('reactflow', () => ({
    Handle: ({ type, position }: { type: string; position: string }) => (
        <div data-testid={`handle-${type}-${position}`} />
    ),
    Position: {
        Left: 'left',
        Right: 'right',
        Top: 'top',
        Bottom: 'bottom'
    },
}));

describe('FormNode Component', () => {
    const mockData = {
        id: 'node1',
        name: 'Test Form',
        fields: [
            { id: 'field1', name: 'Field 1', type: 'text', required: true },
            { id: 'field2', name: 'Field 2', type: 'number', required: false },
        ],
        onClick: jest.fn(),
    };

    it('renders the form node with correct content', () => {
        render(<FormNode data={mockData} isConnectable={true} />);

        expect(screen.getByText('Test Form')).toBeInTheDocument();
        expect(screen.getByText('2 fields')).toBeInTheDocument();
    });

    it('renders handles for connections', () => {
        render(<FormNode data={mockData} isConnectable={true} />);

        expect(screen.getByTestId('handle-target-left')).toBeInTheDocument();
        expect(screen.getByTestId('handle-source-right')).toBeInTheDocument();
    });

    it('calls onClick when the node is clicked', () => {
        render(<FormNode data={mockData} isConnectable={true} />);

        fireEvent.click(screen.getByText('Test Form').closest('.form-node')!);
        expect(mockData.onClick).toHaveBeenCalledTimes(1);
    });
});
