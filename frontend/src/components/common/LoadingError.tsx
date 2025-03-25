'use client';

import React from 'react';

interface LoadingErrorProps {
    loading: boolean;
    error: Error | null;
    children: React.ReactNode;
}

/**
 * Component to handle loading and error states
 */
export const LoadingError: React.FC<LoadingErrorProps> = ({ loading, error, children }) => {
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="text-xl font-semibold mb-2">Loading...</div>
                    <div className="text-gray-500">Please wait while we fetch the data.</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error">
                <h3>Error</h3>
                <p className="error-details">{error.message}</p>
            </div>
        );
    }

    return <>{children}</>;
};
