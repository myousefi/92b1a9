import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { FaWpforms } from 'react-icons/fa';

export const FormNode = memo(({ data }: NodeProps) => {
    const { name, onClick } = data;

    return (
        <div className="custom-node" onClick={onClick}>
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
