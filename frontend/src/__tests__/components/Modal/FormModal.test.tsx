import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormSidebar } from '../../../components/Modals/FormModal';

describe('FormSidebar Component', () => {
    const mockNode = {
        id: 'node1',
        name: 'Test Form',
        fields: [
            { id: 'field1', name: 'Email', type: 'short-text', required: true },
            { id: 'field2', name: 'Age', type: 'number', required: false },
        ],
        position: { x: 100, y: 100 },
    };

    const mockOnClose = jest.fn();

    it('renders nothing when no node is selected', () => {
        const { container } = render(<FormSidebar selectedNode={null} onClose={mockOnClose} />);
        expect(container.firstChild).toBeNull();
    });

    it('renders the sidebar with form details when a node is selected', () => {
        render(<FormSidebar selectedNode={mockNode} onClose={mockOnClose} />);

        expect(screen.getByText('Test Form')).toBeInTheDocument();
        expect(screen.getByText('Form Fields')).toBeInTheDocument();
        expect(screen.getByText('Email')).toBeInTheDocument();
        expect(screen.getByText('Age')).toBeInTheDocument();
        expect(screen.getByText('short-text')).toBeInTheDocument();
        expect(screen.getByText('number')).toBeInTheDocument();
        expect(screen.getByText('Required')).toBeInTheDocument();
        expect(screen.getByText('Optional')).toBeInTheDocument();
    });

    it('calls onClose when the close button is clicked', () => {
        render(<FormSidebar selectedNode={mockNode} onClose={mockOnClose} />);

        fireEvent.click(screen.getByText('×'));
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('displays a message when there are no fields', () => {
        const nodeWithNoFields = {
            ...mockNode,
            fields: [],
        };

        render(<FormSidebar selectedNode={nodeWithNoFields} onClose={mockOnClose} />);

        expect(screen.getByText('No fields available')).toBeInTheDocument();
    });
});
