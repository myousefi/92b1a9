// Node represents a Form
export interface Node {
    id: string;
    name: string;
    fields: Field[];
    // Additional metadata can be added here
}

// Edge represents a Dependency
export interface Edge {
    source: string;    // ID of the upstream form
    target: string;    // ID of the dependent form
    // Additional metadata can be added here
}

// Field represents an individual form field
export interface Field {
    id: string;
    name: string;
    type: string;
    prefillMapping?: PrefillMapping;
    // Additional field properties can be added here
}

// PrefillMapping defines a mapping from a source data field to a target field
export interface PrefillMapping {
    sourceType: 'direct' | 'transitive' | 'global';
    sourceFormId?: string;
    sourceFieldId: string;
    targetFieldId: string;
    // Additional mapping metadata can be added here
}

// GraphResponse represents the API response structure
export interface GraphResponse {
    nodes: Node[];
    edges: Edge[];
}

// DataSource represents a source of data for prefilling
export interface DataSource {
    id: string;
    name: string;
    type: string;
    // Additional metadata can be added here
}

// DataSourceProvider interface for different data source implementations
export interface DataSourceProvider {
    getType(): string;
    getName(): string;
    getAvailableSources(formId: string): Promise<DataSource[]>;
    getFieldsForSource(sourceId: string): Promise<Field[]>;
}
