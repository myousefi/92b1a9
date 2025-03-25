import { DataSourceProvider, DataSource, Field } from '../../types';

export class GlobalDataSource implements DataSourceProvider {
    getType(): string {
        return 'global';
    }

    getName(): string {
        return 'Global Properties';
    }

    async getAvailableSources(formId: string): Promise<DataSource[]> {
        // Return some example global data sources
        return [
            { id: 'global_user', name: 'User Properties', type: 'global' },
            { id: 'global_org', name: 'Organization Properties', type: 'global' },
            { id: 'global_action', name: 'Action Properties', type: 'global' }
        ];
    }

    async getFieldsForSource(sourceId: string): Promise<Field[]> {
        // Return example fields based on the source
        if (sourceId === 'global_user') {
            return [
                { id: 'user_id', name: 'User ID', type: 'string', required: true },
                { id: 'user_name', name: 'User Name', type: 'string', required: true },
                { id: 'user_email', name: 'User Email', type: 'string', required: true }
            ];
        }

        if (sourceId === 'global_org') {
            return [
                { id: 'org_id', name: 'Organization ID', type: 'string', required: true },
                { id: 'org_name', name: 'Organization Name', type: 'string', required: true }
            ];
        }

        if (sourceId === 'global_action') {
            return [
                { id: 'action_id', name: 'Action ID', type: 'string', required: true },
                { id: 'action_name', name: 'Action Name', type: 'string', required: true },
                { id: 'action_status', name: 'Action Status', type: 'string', required: true }
            ];
        }

        return [];
    }
}
