'use client';

import { useGraphData } from '../../hooks/useGraphData';
import { LoadingError } from '../../components/common/LoadingError';

export default function GraphDisplay() {
    const { data, loading, error } = useGraphData();

    return (
        <LoadingError loading={loading} error={error}>
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Journey Builder</h1>

                {data && (
                    <div>
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold">Forms</h2>
                            <ul className="list-disc pl-5">
                                {data.nodes.map(node => (
                                    <li key={node.id}>
                                        {node.name} (ID: {node.id}) - {node.fields.length} fields
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold">Dependencies</h2>
                            <ul className="list-disc pl-5">
                                {data.edges.map((edge, index) => (
                                    <li key={index}>
                                        {edge.source} → {edge.target}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </LoadingError>
    );
}
