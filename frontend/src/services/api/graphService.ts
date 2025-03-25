import { GraphResponse, ProcessedGraphData, Field } from '../../types';
import { apiGet, getBlueprintGraphUrl } from './apiClient';

// Define the API URL, defaulting to localhost if not provided
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

/**
 * Fetches the graph data from the API and transforms it
 * @returns Promise with the processed graph data
 */
export async function fetchGraphData(): Promise<ProcessedGraphData> {
    try {
        const url = getBlueprintGraphUrl();
        console.log('Requesting graph data from:', url);

        const data = await apiGet<GraphResponse>(url);
        return processGraphData(data);
    } catch (error) {
        console.error('Error fetching graph data:', error);
        throw error;
    }
}

/**
 * Transforms the raw graph data into a more usable format
 * @param data The raw graph data from the API
 * @returns Processed graph data for the UI
 */
function processGraphData(data: GraphResponse): ProcessedGraphData {
    // Create a map of form IDs to their field definitions
    const formFieldsMap = new Map<string, Field[]>();

    data.forms.forEach(form => {
        const fields: Field[] = [];

        // Extract fields from the form's field_schema
        Object.entries(form.field_schema.properties).forEach(([fieldId, fieldDef]) => {
            fields.push({
                id: fieldId,
                name: fieldDef.title || fieldId,
                type: fieldDef.avantos_type || fieldDef.type,
                required: form.field_schema.required.includes(fieldId),
            });
        });

        formFieldsMap.set(form.id, fields);
    });

    // Transform nodes to include their fields
    const processedNodes = data.nodes.map(node => {
        const formId = node.data.component_id;
        const fields = formFieldsMap.get(formId) || [];

        return {
            id: node.id,
            name: node.data.name,
            fields,
            position: node.position,
        };
    });

    return {
        nodes: processedNodes,
        edges: data.edges,
    };
}
