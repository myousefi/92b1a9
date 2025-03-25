'use client';

import React, { useState, useEffect } from 'react';
import { Field, PrefillMapping, DataSource } from '../../types';
import BaseModal from '../common/BaseModal';
import { getDirectDependencies } from '../../utils/graph/traversal';
import { getTransitiveDependencies } from '../../utils/graph/traversal';
import { getGlobalDataSources } from '../../services/dataSources/globalDataService';

interface PrefillConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (mapping: PrefillMapping | null) => void;
    field: Field;
    formId: string;
}

export const PrefillConfigModal: React.FC<PrefillConfigModalProps> = ({
    isOpen,
    onClose,
    onSave,
    field,
    formId
}) => {
    const [activeTab, setActiveTab] = useState<'direct' | 'transitive' | 'global'>('direct');
    const [directSources, setDirectSources] = useState<DataSource[]>([]);
    const [transitiveSources, setTransitiveSources] = useState<DataSource[]>([]);
    const [globalSources, setGlobalSources] = useState<DataSource[]>([]);
    const [selectedSource, setSelectedSource] = useState<DataSource | null>(null);
    const [selectedField, setSelectedField] = useState<Field | null>(null);
    const [sourceFields, setSourceFields] = useState<Field[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSources = async () => {
            setLoading(true);
            try {
                // Fetch direct dependencies
                const direct = await getDirectDependencies(formId);
                setDirectSources(direct);

                // Fetch transitive dependencies
                const transitive = await getTransitiveDependencies(formId);
                setTransitiveSources(transitive);

                // Fetch global data sources
                const global = await getGlobalDataSources();
                setGlobalSources(global);
            } catch (error) {
                console.error('Error fetching data sources:', error);
            } finally {
                setLoading(false);
            }
        };

        if (isOpen) {
            fetchSources();
        }
    }, [isOpen, formId]);

    const handleSourceSelect = async (source: DataSource) => {
        setSelectedSource(source);
        setSelectedField(null);
        setLoading(true);

        try {
            // This would be a real API call in a production app
            // For now, we'll mock some fields
            const fields: Field[] = [
                { id: 'id', name: 'ID', type: 'string', required: true },
                { id: 'name', name: 'Name', type: 'string', required: true },
                { id: 'email', name: 'Email', type: 'string', required: true },
                { id: 'age', name: 'Age', type: 'number', required: false },
            ];
            setSourceFields(fields);
        } catch (error) {
            console.error('Error fetching source fields:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFieldSelect = (field: Field) => {
        setSelectedField(field);
    };

    const handleSave = () => {
        if (!selectedSource || !selectedField) return;

        const mapping: PrefillMapping = {
            sourceType: activeTab,
            sourceFormId: activeTab !== 'global' ? selectedSource.id : undefined,
            sourceFieldId: selectedField.id,
            targetFieldId: field.id
        };

        onSave(mapping);
    };

    const renderSourceList = () => {
        let sources: DataSource[] = [];

        switch (activeTab) {
            case 'direct':
                sources = directSources;
                break;
            case 'transitive':
                sources = transitiveSources;
                break;
            case 'global':
                sources = globalSources;
                break;
        }

        if (loading) {
            return <div className="loading">Loading sources...</div>;
        }

        if (sources.length === 0) {
            return <div className="no-sources">No sources available</div>;
        }

        return (
            <ul className="source-list">
                {sources.map(source => (
                    <li
                        key={source.id}
                        className={`source-item ${selectedSource?.id === source.id ? 'selected' : ''}`}
                        onClick={() => handleSourceSelect(source)}
                    >
                        {source.name}
                    </li>
                ))}
            </ul>
        );
    };

    const renderFieldList = () => {
        if (!selectedSource) {
            return <div className="no-source-selected">Select a source first</div>;
        }

        if (loading) {
            return <div className="loading">Loading fields...</div>;
        }

        if (sourceFields.length === 0) {
            return <div className="no-fields">No fields available</div>;
        }

        return (
            <ul className="field-list">
                {sourceFields.map(field => (
                    <li
                        key={field.id}
                        className={`field-item ${selectedField?.id === field.id ? 'selected' : ''}`}
                        onClick={() => handleFieldSelect(field)}
                    >
                        <div className="field-name">{field.name}</div>
                        <div className="field-type">{field.type}</div>
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Configure Prefill"
            position="left"
        >
            <div className="modal-header">
                <h2>Configure Prefill for {field.name}</h2>
                <button className="close-button" onClick={onClose}>×</button>
            </div>

            <div className="modal-content">
                <div className="tabs">
                    <button
                        className={`tab ${activeTab === 'direct' ? 'active' : ''}`}
                        onClick={() => setActiveTab('direct')}
                    >
                        Direct Dependencies
                    </button>
                    <button
                        className={`tab ${activeTab === 'transitive' ? 'active' : ''}`}
                        onClick={() => setActiveTab('transitive')}
                    >
                        Transitive Dependencies
                    </button>
                    <button
                        className={`tab ${activeTab === 'global' ? 'active' : ''}`}
                        onClick={() => setActiveTab('global')}
                    >
                        Global Data
                    </button>
                </div>

                <div className="prefill-config-container">
                    <div className="sources-panel">
                        <h3>Data Sources</h3>
                        {renderSourceList()}
                    </div>

                    <div className="fields-panel">
                        <h3>Available Fields</h3>
                        {renderFieldList()}
                    </div>
                </div>

                <div className="modal-footer">
                    <button
                        className="cancel-button"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="save-button"
                        onClick={handleSave}
                        disabled={!selectedSource || !selectedField}
                    >
                        Save
                    </button>
                </div>
            </div>
        </BaseModal>
    );
};
