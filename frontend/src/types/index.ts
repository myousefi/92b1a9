// Node represents a form, branch, trigger, or configuration in the graph
export interface Node {
    id: string;
    type: 'form' | 'branch' | 'trigger' | 'configuration';
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

// Edge represents a dependency between nodes
export interface Edge {
    source: string;
    target: string;
    [key: string]: any;
}

// Form represents a detailed form definition
export interface Form {
    $schema: string;
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
    dynamic_field_config: Record<string, object>;
    custom_javascript?: string;
    vendor_schema?: Record<string, any>;
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
    $schema: string;
    blueprint_id: string;
    blueprint_name: string;
    tenant_id: string;
    status: 'draft' | 'published' | 'historical' | 'archived';
    version_id: string;
    version_notes: string;
    version_number: string;
    branches: Branch[] | null;
    edges: Edge[] | null;
    forms: Form[] | null;
    nodes: Node[] | null;
    triggers: TriggerEndpoint[] | null;
}

// Branch represents a decision point in the action blueprint
export interface Branch {
    $schema: string;
    id: string;
    name: string;
    description: string;
    tenant_id: string;
    condition: Record<string, any>;
    created_at: string; // date-time
    created_by: string;
    updated_at: string; // date-time
}

// TriggerEndpoint represents a trigger endpoint associated with the action blueprint
export interface TriggerEndpoint {
    $schema: string;
    id: string;
    name: string;
    trigger_service_id: string;
    path_template: string;
    path_template_variables: string[] | null;
    query_parameter_template: Record<string, string>;
    query_parameter_template_variables: string[] | null;
    payload_template: Record<string, any>;
    payload_template_variables: string[] | null;
    output_mapping: Record<string, string>;
    request_method: 'POST' | 'PUT' | 'GET' | 'DELETE';
    created_at: string; // date-time
    updated_at: string; // date-time
    max_retries?: number;
    timeout_seconds?: number;
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
