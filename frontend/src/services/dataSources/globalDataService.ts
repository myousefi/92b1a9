import { DataSource, Field } from '../../types';

/**
 * Gets global data sources for prefilling
 * @returns Promise with an array of global data sources
 */
export async function getGlobalDataSources(): Promise<DataSource[]> {
    // This would normally fetch from an API, but we'll mock it for now
    return [
        {
            id: 'action_properties',
            name: 'Action Properties',
            type: 'global'
        },
        {
            id: 'organization_properties',
            name: 'Organization Properties',
            type: 'global'
        }
    ];
}

/**
 * Gets fields for a global data source
 * @param sourceId The ID of the global data source
 * @returns Promise with an array of fields
 */
export async function getGlobalFields(sourceId: string): Promise<Field[]> {
    // This would normally fetch from an API, but we'll mock it for now
    if (sourceId === 'action_properties') {
        return [
            { id: 'action_id', name: 'Action ID', type: 'string', required: true },
            { id: 'action_name', name: 'Action Name', type: 'string', required: true },
            { id: 'created_at', name: 'Created At', type: 'date', required: true },
            { id: 'status', name: 'Status', type: 'string', required: true }
        ];
    } else if (sourceId === 'organization_properties') {
        return [
            { id: 'org_id', name: 'Organization ID', type: 'string', required: true },
            { id: 'org_name', name: 'Organization Name', type: 'string', required: true },
            { id: 'industry', name: 'Industry', type: 'string', required: false },
            { id: 'employee_count', name: 'Employee Count', type: 'number', required: false }
        ];
    }

    return [];
}
