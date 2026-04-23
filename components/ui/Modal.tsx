'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ModalProps } from '@/types';

export const Modal = ({ isOpen, onClose, children, title }: ModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const previousActiveElement = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (isOpen) {
            previousActiveElement.current = document.activeElement as HTMLElement;
            modalRef.current?.focus();

            const handleEscape = (e: KeyboardEvent): void => {
                if (e.key === 'Escape') {
                    onClose();
                }
            };

            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';

            return () => {
                document.removeEventListener('keydown', handleEscape);
                document.body.style.overflow = 'unset';
                previousActiveElement.current?.focus();
            };
        }
    }, [isOpen, onClose]);

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>): void => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const trapFocus = (e: React.KeyboardEvent<HTMLDivElement>): void => {
        if (!modalRef.current) return;

        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.key === 'Tab') {
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn"
            onClick={handleOverlayClick}
        >
            <div
                ref={modalRef}
                className="bg-[var(--bg-secondary)] rounded-lg p-8 md:p-12 max-w-lg w-11/12 max-h-[90vh] overflow-y-auto animate-slideIn"
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? "modal-title" : undefined}
                tabIndex={-1}
                onKeyDown={trapFocus}
            >
                {title && (
                    <h2 id="modal-title" className="text-2xl font-bold mb-6">
                        {title}
                    </h2>
                )}
                {children}
            </div>
        </div>,
        document.body
    );
};