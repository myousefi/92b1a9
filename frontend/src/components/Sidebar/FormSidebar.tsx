'use client';

import React, { useState } from 'react';
import { ProcessedNode, Field, PrefillMapping } from '../../types';
import BaseModal from '../common/BaseModal';
import { PrefillConfigModal } from '../Modals/PrefillConfigModal';

interface FormSidebarProps {
    selectedNode: ProcessedNode | null;
    onClose: () => void;
}

export const FormSidebar: React.FC<FormSidebarProps> = ({ selectedNode, onClose }) => {
    const [selectedField, setSelectedField] = useState<Field | null>(null);
    const [prefillMappings, setPrefillMappings] = useState<Record<string, PrefillMapping>>({});

    if (!selectedNode) {
        return null;
    }

    const handleConfigureClick = (field: Field) => {
        setSelectedField(field);
    };

    const handleCloseConfig = () => {
        setSelectedField(null);
    };

    const handleSavePrefill = (mapping: PrefillMapping | null) => {
        if (!selectedField) return;

        if (mapping) {
            setPrefillMappings(prev => ({
                ...prev,
                [selectedField.id]: mapping
            }));
        }

        setSelectedField(null);
    };

    const handleRemovePrefill = (fieldId: string) => {
        setPrefillMappings(prev => {
            const newMappings = { ...prev };
            delete newMappings[fieldId];
            return newMappings;
        });
    };

    const getPrefillDisplay = (field: Field) => {
        const mapping = prefillMappings[field.id];
        if (!mapping) return 'None';

        if (mapping.sourceType === 'global') {
            return `Global: ${mapping.sourceFieldId}`;
        }

        return `${mapping.sourceFormId}: ${mapping.sourceFieldId}`;
    };

    return (
        <>
            <BaseModal
                isOpen={!!selectedNode}
                onRequestClose={onClose}
                contentLabel="Form Details"
                position="center"
            >
                <div className="modal-header">
                    <h2>{selectedNode.name}</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>

                <div className="modal-content">
                    <div className="modal-section">
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
                                                <span className="prefill-value">{getPrefillDisplay(field)}</span>

                                                {prefillMappings[field.id] ? (
                                                    <button
                                                        className="prefill-remove-button"
                                                        onClick={() => handleRemovePrefill(field.id)}
                                                    >
                                                        ×
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="prefill-configure-button"
                                                        onClick={() => handleConfigureClick(field)}
                                                    >
                                                        Configure
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </BaseModal>

            {selectedField && (
                <PrefillConfigModal
                    isOpen={!!selectedField}
                    onClose={handleCloseConfig}
                    onSave={handleSavePrefill}
                    field={selectedField}
                    formId={selectedNode.id}
                />
            )}
        </>
    );
};