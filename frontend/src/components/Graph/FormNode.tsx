import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { FaWpforms } from 'react-icons/fa'; // Import form icon

export const FormNode = memo(({ data }: NodeProps) => {
    const { name } = data;

    return (
        <div className="custom-node">
            {/* Left handle (target) */}
            <Handle
                type="target"
                position={Position.Left}
                className="node-handle node-handle-left"
            />

            <div className="node-icon">
                <FaWpforms size={22} />
            </div>

            <div className="node-text">
                <div className="node-title">Form</div>
                <div className="node-name">{name}</div>
            </div>

            {/* Right handle (source) */}
            <Handle
                type="source"
                position={Position.Right}
                className="node-handle node-handle-right"
            />
        </div>
    );
});

FormNode.displayName = 'FormNode';
