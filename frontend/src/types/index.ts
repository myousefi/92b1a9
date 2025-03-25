// Node represents a form in the graph
export interface Node {
    id: string;
    type: string;
    position: {
        x: number;
        y: number;
    };
    data: {
        id?: string;
        component_id: string;
        name: string;
        [key: string]: any;
    };
}

// Edge represents a dependency between forms
export interface Edge {
    source: string;
    target: string;
    [key: string]: any;
}

// Form represents a detailed form definition
export interface Form {
    id: string;
    name: string;
    description: string;
    is_reusable: boolean;
    field_schema: {
        type: string;
        properties: {
            [key: string]: {
                avantos_type?: string;
                title?: string;
                type: string;
                [key: string]: any;
            }
        };
        required: string[];
    };
    ui_schema: any;
    dynamic_field_config: { [key: string]: any };
}

// Field represents a form field extracted from form schema
export interface Field {
    id: string;
    name: string;
    type: string;
    required: boolean;
}

// PrefillMapping defines how a field gets prefilled
export interface PrefillMapping {
    sourceType: 'direct' | 'transitive' | 'global';
    sourceFormId?: string;
    sourceFieldId: string;
    targetFieldId: string;
}

// GraphResponse represents the API response structure
export interface GraphResponse {
    $schema?: string;
    id?: string;
    tenant_id?: string;
    name?: string;
    description?: string;
    category?: string;
    branches?: any[];
    edges: Edge[];
    forms: Form[];
    nodes: Node[];
    triggers?: any[];
}

// ProcessedNode is a simplified node with extracted fields
export interface ProcessedNode {
    id: string;
    name: string;
    fields: Field[];
    position: {
        x: number;
        y: number;
    };
}

// ProcessedGraphData is the transformed data for our UI
export interface ProcessedGraphData {
    nodes: ProcessedNode[];
    edges: Edge[];
}

// DataSource represents a source of data for prefilling
export interface DataSource {
    id: string;
    name: string;
    type: string;
}

// DataSourceProvider interface for different data source implementations
export interface DataSourceProvider {
    getType(): string;
    getName(): string;
    getAvailableSources(formId: string): Promise<DataSource[]>;
    getFieldsForSource(sourceId: string): Promise<Field[]>;
}
