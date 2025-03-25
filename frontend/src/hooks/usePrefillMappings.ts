import { useState, useCallback } from 'react';
import { PrefillMapping } from '../types';

export function usePrefillMappings() {
    const [prefillMappings, setPrefillMappings] = useState<Record<string, PrefillMapping | null>>({});

    const setMapping = useCallback((
        targetFieldId: string,
        sourceType: 'direct' | 'transitive' | 'global',
        sourceFormId: string | undefined,
        sourceFieldId: string
    ) => {
        setPrefillMappings(prev => ({
            ...prev,
            [targetFieldId]: {
                sourceType,
                sourceFormId,
                sourceFieldId,
                targetFieldId
            }
        }));
    }, []);

    const clearMapping = useCallback((targetFieldId: string) => {
        setPrefillMappings(prev => ({
            ...prev,
            [targetFieldId]: null
        }));
    }, []);

    return {
        prefillMappings,
        setMapping,
        clearMapping
    };
}
