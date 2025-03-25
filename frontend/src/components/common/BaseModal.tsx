'use client';

import React, { useEffect } from 'react';
import Modal from 'react-modal';

interface BaseModalProps extends React.ComponentProps<typeof Modal> {
    position?: 'center' | 'left';
}

const BaseModal: React.FC<BaseModalProps> = ({
    children,
    position = 'center',
    className,
    overlayClassName,
    ...props
}) => {
    useEffect(() => {
        if (typeof window !== 'undefined') {
            Modal.setAppElement('body');
        }
    }, []);

    // Determine class names based on position
    const modalClass = position === 'center'
        ? 'modal-center'
        : 'modal-left';

    const baseClassName = className || modalClass;
    const baseOverlayClassName = overlayClassName || 'modal-overlay';

    return (
        <Modal
            {...props}
            className={baseClassName}
            overlayClassName={baseOverlayClassName}
            ariaHideApp={false}
        >
            {children}
        </Modal>
    );
};

// Make sure to export the component as default
export default BaseModal;
