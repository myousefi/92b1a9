import { DataSourceProvider } from '../../types';

export class DataSourceRegistry {
    private providers: DataSourceProvider[] = [];

    registerProvider(provider: DataSourceProvider): void {
        this.providers.push(provider);
    }

    getProviders(): DataSourceProvider[] {
        return this.providers;
    }

    getProviderByType(type: string): DataSourceProvider | undefined {
        return this.providers.find(provider => provider.getType() === type);
    }
}

// Create a singleton instance
export const dataSourceRegistry = new DataSourceRegistry();
