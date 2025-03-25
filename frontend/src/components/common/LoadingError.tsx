'use client';

import React from 'react';

interface LoadingErrorProps {
    message: string;
    error: Error;
}

/**
 * Component to handle loading and error states
 */
export const LoadingError: React.FC<LoadingErrorProps> = ({ message, error }) => {
    return (
        <div className="error-container">
            <h3>{message}</h3>
            <p className="error-details">{error.message}</p>
        </div>
    );
};
