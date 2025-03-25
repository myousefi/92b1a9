'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ProcessedNode, Field } from '../../types';

// Import the modal dynamically with SSR disabled
const ClientModal = dynamic(() => import('../common/ClientModal'), { ssr: false });

interface FormSidebarProps {
    selectedNode: ProcessedNode | null;
    onClose: () => void;
}

export const FormSidebar: React.FC<FormSidebarProps> = ({ selectedNode, onClose }) => {
    if (!selectedNode) {
        return null;
    }

    return (
        <ClientModal
            isOpen={true} // Always open when selectedNode exists
            onRequestClose={onClose}
            contentLabel="Form Details"
            className="form-modal"
            overlayClassName="form-modal-overlay"
        >
            <div className="form-modal-header">
                <h2>{selectedNode.name}</h2>
                <button className="close-button" onClick={onClose}>×</button>
            </div>

            <div className="form-modal-content">
                <div className="form-modal-section">
                    <h3>Form Fields</h3>
                    {selectedNode.fields.length === 0 ? (
                        <p className="no-fields">No fields available</p>
                    ) : (
                        <ul className="field-list">
                            {selectedNode.fields.map((field: Field) => (
                                <li key={field.id} className="field-item">
                                    <div className="field-header">
                                        <span className="field-name">{field.name}</span>
                                        <span className={`field-type ${field.type}`}>{field.type}</span>
                                    </div>
                                    <div className="field-details">
                                        <span className={`field-required ${field.required ? 'required' : 'optional'}`}>
                                            {field.required ? 'Required' : 'Optional'}
                                        </span>
                                        <div className="field-prefill">
                                            <span className="prefill-label">Prefill:</span>
                                            <span className="prefill-value">None</span>
                                            <button className="prefill-configure-button">Configure</button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </ClientModal>
    );
};
