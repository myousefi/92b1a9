import { render, screen } from '@testing-library/react';
import { LoadingError } from '../../../components/common/LoadingError';

describe('LoadingError', () => {
    it('should show loading state', () => {
        render(
            <LoadingError loading={true} error={null}>
                <div>Content</div>
            </LoadingError>
        );

        expect(screen.getByText('Loading...')).toBeInTheDocument();
        expect(screen.queryByText('Content')).not.toBeInTheDocument();
    });

    it('should show error state', () => {
        const error = new Error('Test error');

        render(
            <LoadingError loading={false} error={error}>
                <div>Content</div>
            </LoadingError>
        );

        expect(screen.getByText('Error')).toBeInTheDocument();
        expect(screen.getByText('Test error')).toBeInTheDocument();
        expect(screen.getByText('Retry')).toBeInTheDocument();
        expect(screen.queryByText('Content')).not.toBeInTheDocument();
    });

    it('should show children when not loading and no error', () => {
        render(
            <LoadingError loading={false} error={null}>
                <div>Content</div>
            </LoadingError>
        );

        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
        expect(screen.queryByText('Error')).not.toBeInTheDocument();
        expect(screen.getByText('Content')).toBeInTheDocument();
    });
});
