// Node represents a form in the graph
export interface Node {
    id: string;
    type: string;
    position: {
        x: number;
        y: number;
    };
    data: {
        id: string;
        component_key: string;
        component_type: string;
        component_id: string;
        name: string;
        prerequisites: string[];
        permitted_roles: string[];
        input_mapping: Record<string, any>;
        sla_duration: {
            number: number;
            unit: string;
        };
        approval_required: boolean;
        approval_roles: string[];
    };
}

// Edge represents a dependency between forms
export interface Edge {
    source: string;
    target: string;
}

// Form represents a detailed form definition
export interface Form {
    id: string;
    name: string;
    description: string;
    is_reusable: boolean;
    field_schema: {
        type: string;
        properties: Record<string, {
            avantos_type?: string;
            title?: string;
            type: string;
            format?: string;
            items?: {
                enum?: string[];
                type: string;
            };
            enum?: any[] | null;
            uniqueItems?: boolean;
        }>;
        required: string[];
    };
    ui_schema: {
        type: string;
        elements: Array<{
            type: string;
            scope: string;
            label: string;
            options?: Record<string, any>;
        }>;
    };
    dynamic_field_config?: Record<string, {
        selector_field: string;
        payload_fields: Record<string, {
            type: string;
            value: string;
        }>;
        endpoint_id: string;
    }>;
}

// Field represents a form field extracted from form schema
export interface Field {
    id: string;
    name: string;
    type: string;
    required: boolean;
    prefillMapping?: PrefillMapping;
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
    id: string;
    tenant_id: string;
    name: string;
    description: string;
    category: string;
    nodes: Node[];
    edges: Edge[];
    forms: Form[];
    branches: any[];
    triggers: any[];
}

// ProcessedNode is a simplified node with extracted fields
export interface ProcessedNode {
    id: string;
    name: string;
    fields: Field[];
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
