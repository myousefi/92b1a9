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
            <div className="flex items-center justify-center h-screen">
                <div className="text-center text-red-500">
                    <div className="text-xl font-semibold mb-2">Error</div>
                    <div>{error.message}</div>
                    <button
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={() => window.location.reload()}
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};
