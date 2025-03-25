import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

interface FormNodeProps {
    data: {
        id: string;
        name: string;
        fields: any[];
        onClick?: () => void;
    };
    isConnectable: boolean;
}

export const FormNode = memo<FormNodeProps>(({ data, isConnectable }) => {
    return (
        <div
            className="form-node"
            onClick={data.onClick}
        >
            <Handle
                type="target"
                position={Position.Left}
                isConnectable={isConnectable}
            />
            <div className="form-node-content">
                <div className="form-node-title">{data.name}</div>
                <div className="form-node-fields">
                    {data.fields.length} fields
                </div>
            </div>
            <Handle
                type="source"
                position={Position.Right}
                isConnectable={isConnectable}
            />
        </div>
    );
});

FormNode.displayName = 'FormNode';
