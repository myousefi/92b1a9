import React from 'react';
import { render, screen } from '@testing-library/react';
import { LoadingError } from '../../../components/common/LoadingError';

describe('LoadingError Component', () => {
    it('displays the error message', () => {
        const message = 'Failed to load data';
        const error = new Error('Network error');

        render(<LoadingError message={message} error={error} />);

        expect(screen.getByText(message)).toBeInTheDocument();
        expect(screen.getByText('Network error')).toBeInTheDocument();
    });
});
