'use client';

import React, { useEffect } from 'react';
import Modal from 'react-modal';

// Create a client-side modal component
const ClientModal: React.FC<React.ComponentProps<typeof Modal>> = ({
    children,
    className,
    overlayClassName,
    ...props
}) => {
    useEffect(() => {
        // Only run on client side
        if (typeof window !== 'undefined') {
            try {
                Modal.setAppElement('body');
            } catch (e) {
                console.warn('Could not set app element for Modal', e);
            }
        }
    }, []);

    // Ensure we're using the provided class names
    const modalClassName = {
        base: className || 'form-modal',
        afterOpen: 'form-modal-after-open',
        beforeClose: 'form-modal-before-close'
    };

    const overlayClassNames = {
        base: overlayClassName || 'form-modal-overlay',
        afterOpen: 'form-modal-overlay-after-open',
        beforeClose: 'form-modal-overlay-before-close'
    };

    return (
        <Modal
            {...props}
            className={modalClassName}
            overlayClassName={overlayClassNames}
            ariaHideApp={false}
            closeTimeoutMS={300}
        >
            {children}
        </Modal>
    );
};

export default ClientModal;
