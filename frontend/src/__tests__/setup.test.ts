import { Node, Edge, Field, PrefillMapping, GraphResponse, DataSource, DataSourceProvider } from '../types';

describe('Project Setup', () => {
  // Test that Jest is configured correctly
  it('should have Jest configured correctly', () => {
    expect(1 + 1).toBe(2);
  });

  // Test that types are imported correctly
  it('should import types correctly', () => {
    // Just check that the types exist
    expect(typeof Node).toBe('undefined'); // TypeScript interfaces don't exist at runtime
    expect(typeof Edge).toBe('undefined');
    expect(typeof Field).toBe('undefined');
    expect(typeof PrefillMapping).toBe('undefined');
    expect(typeof GraphResponse).toBe('undefined');
    expect(typeof DataSource).toBe('undefined');
    expect(typeof DataSourceProvider).toBe('undefined');

    // This test will pass if the imports don't throw errors
    expect(true).toBe(true);
  });
});
