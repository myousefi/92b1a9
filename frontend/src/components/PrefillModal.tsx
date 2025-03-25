import React, { useState } from 'react';
import Modal from 'react-modal';

interface PrefillModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    field: string;
    prefillValue?: string;
    onSave: (prefillValue: string | null) => void;
}

export const PrefillModal: React.FC<PrefillModalProps> = ({
    isOpen,
    onRequestClose,
    field,
    prefillValue = '',
    onSave,
}) => {
    const [value, setValue] = useState(prefillValue);

    const handleSave = () => {
        onSave(value);
        onRequestClose();
    };

    const handleClear = () => {
        setValue('');
        onSave(null); // Clear the prefill value
        onRequestClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Prefill Configuration"
            className="form-modal"
            overlayClassName="form-modal-overlay"
        >
            <div className="form-modal-header">
                <h2>Configure Prefill for {field}</h2>
                <button className="close-button" onClick={onRequestClose}>×</button>
            </div>
            <div className="form-modal-content">
                <div className="prefill-field">
                    <label htmlFor="prefill-input">Prefill Value:</label>
                    <input
                        id="prefill-input"
                        type="text"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="Enter prefill value"
                    />
                </div>
                <div className="modal-actions">
                    <button className="save-button" onClick={handleSave}>
                        Save
                    </button>
                    <button className="clear-button" onClick={handleClear}>
                        Clear
                    </button>
                </div>
            </div>
        </Modal>
    );
};