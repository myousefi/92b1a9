import React from 'react';
import { ProcessedNode, Field, PrefillMapping } from '../../types';
import { FaTimes } from 'react-icons/fa';

interface PrefillMappingModalProps {
    node: ProcessedNode | null;
    isOpen: boolean;
    onClose: () => void;
    prefillMappings: Record<string, PrefillMapping | null>;
    onEditMapping: (fieldId: string) => void;
    onClearMapping: (fieldId: string) => void;
}

export const PrefillMappingModal: React.FC<PrefillMappingModalProps> = ({
    node,
    isOpen,
    onClose,
    prefillMappings,
    onEditMapping,
    onClearMapping,
}) => {
    if (!isOpen || !node) return null;

    const renderMappingValue = (fieldId: string) => {
        const mapping = prefillMappings[fieldId];
        if (!mapping) return <span className="text-gray-400">No mapping configured</span>;

        let sourceName = '';
        switch (mapping.sourceType) {
            case 'direct':
                sourceName = `Direct: Form ${mapping.sourceFormId}`;
                break;
            case 'transitive':
                sourceName = `Transitive: Form ${mapping.sourceFormId}`;
                break;
            case 'global':
                sourceName = 'Global Property';
                break;
        }

        return (
            <span className="text-blue-600">
                {sourceName}.{mapping.sourceFieldId}
            </span>
        );
    };

    return (
        <div className="modal-backdrop">
            <div className="prefill-mapping-modal">
                <div className="modal-header">
                    <h2>Prefill Configuration for {node.name}</h2>
                    <button className="close-button" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>
                <div className="modal-body">
                    <div className="field-list">
                        {node.fields.map((field) => (
                            <div key={field.id} className="field-item">
                                <div className="field-info">
                                    <span className="field-name">{field.name}</span>
                                    <span className="field-type">{field.type}</span>
                                </div>
                                <div className="field-mapping">
                                    {renderMappingValue(field.id)}
                                </div>
                                <div className="field-actions">
                                    <button
                                        className="edit-button"
                                        onClick={() => onEditMapping(field.id)}
                                    >
                                        Edit
                                    </button>
                                    {prefillMappings[field.id] && (
                                        <button
                                            className="clear-button"
                                            onClick={() => onClearMapping(field.id)}
                                        >
                                            <FaTimes />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
