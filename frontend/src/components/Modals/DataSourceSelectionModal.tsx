import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { DataSource, Field, ProcessedNode } from '../../types';
import { useDataSources } from '../../hooks/useDataSources';

interface DataSourceSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentNodeId: string;
    targetFieldId: string;
    onSelectDataSource: (sourceType: 'direct' | 'transitive' | 'global', sourceFormId: string | undefined, sourceFieldId: string) => void;
    nodes: ProcessedNode[];
    edges: { source: string; target: string }[];
}

export const DataSourceSelectionModal: React.FC<DataSourceSelectionModalProps> = ({
    isOpen,
    onClose,
    currentNodeId,
    targetFieldId,
    onSelectDataSource,
    nodes,
    edges,
}) => {
    const {
        directSources,
        transitiveSources,
        globalSources,
        getFieldsForSource
    } = useDataSources(currentNodeId, nodes, edges);

    const [selectedSourceType, setSelectedSourceType] = useState<'direct' | 'transitive' | 'global' | null>(null);
    const [selectedSource, setSelectedSource] = useState<DataSource | null>(null);
    const [availableFields, setAvailableFields] = useState<Field[]>([]);

    useEffect(() => {
        // Reset selections when modal opens/closes
        if (!isOpen) {
            setSelectedSourceType(null);
            setSelectedSource(null);
            setAvailableFields([]);
        }
    }, [isOpen]);

    useEffect(() => {
        // Reset source and fields when source type changes
        setSelectedSource(null);
        setAvailableFields([]);
    }, [selectedSourceType]);

    useEffect(() => {
        // Load fields when a source is selected
        if (selectedSource) {
            const loadFields = async () => {
                const fields = await getFieldsForSource(selectedSource.id);
                setAvailableFields(fields);
            };
            loadFields();
        } else {
            setAvailableFields([]);
        }
    }, [selectedSource, getFieldsForSource]);

    if (!isOpen) return null;

    const handleSourceTypeSelect = (type: 'direct' | 'transitive' | 'global') => {
        setSelectedSourceType(type);
    };

    const handleSourceSelect = (source: DataSource) => {
        setSelectedSource(source);
    };

    const handleFieldSelect = (fieldId: string) => {
        if (selectedSourceType && selectedSource) {
            onSelectDataSource(
                selectedSourceType,
                selectedSourceType === 'global' ? undefined : selectedSource.id,
                fieldId
            );
            onClose();
        }
    };

    const getSourcesForType = () => {
        switch (selectedSourceType) {
            case 'direct':
                return directSources;
            case 'transitive':
                return transitiveSources;
            case 'global':
                return globalSources;
            default:
                return [];
        }
    };

    const renderSourceTypeSelection = () => (
        <div className="source-type-selection">
            <h3>Select Data Source Type</h3>
            <div className="source-type-options">
                <button
                    className={`source-type-button ${selectedSourceType === 'direct' ? 'selected' : ''}`}
                    onClick={() => handleSourceTypeSelect('direct')}
                >
                    Direct Dependencies
                </button>
                <button
                    className={`source-type-button ${selectedSourceType === 'transitive' ? 'selected' : ''}`}
                    onClick={() => handleSourceTypeSelect('transitive')}
                >
                    Transitive Dependencies
                </button>
                <button
                    className={`source-type-button ${selectedSourceType === 'global' ? 'selected' : ''}`}
                    onClick={() => handleSourceTypeSelect('global')}
                >
                    Global Properties
                </button>
            </div>
        </div>
    );

    const renderSourceSelection = () => {
        const sources = getSourcesForType();

        if (sources.length === 0) {
            return (
                <div className="no-sources">
                    <p>No sources available for this type</p>
                </div>
            );
        }

        return (
            <div className="source-selection">
                <h3>Select Source</h3>
                <div className="source-list">
                    {sources.map(source => (
                        <button
                            key={source.id}
                            className={`source-item ${selectedSource?.id === source.id ? 'selected' : ''}`}
                            onClick={() => handleSourceSelect(source)}
                        >
                            {source.name}
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    const renderFieldSelection = () => {
        if (availableFields.length === 0) {
            return (
                <div className="no-fields">
                    <p>No fields available for this source</p>
                </div>
            );
        }

        return (
            <div className="field-selection">
                <h3>Select Field</h3>
                <div className="field-list">
                    {availableFields.map(field => (
                        <button
                            key={field.id}
                            className="field-item"
                            onClick={() => handleFieldSelect(field.id)}
                        >
                            {field.name} ({field.type})
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="modal-backdrop">
            <div className="data-source-modal">
                <div className="modal-header">
                    <h2>Configure Prefill for Field</h2>
                    <button className="close-button" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>
                <div className="modal-body">
                    {renderSourceTypeSelection()}

                    {selectedSourceType && renderSourceSelection()}

                    {selectedSource && renderFieldSelection()}
                </div>
            </div>
        </div>
    );
};
