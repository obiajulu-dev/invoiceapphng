'use client';

import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { DeleteModalProps } from '@/types';

export const DeleteModal = ({ isOpen, onClose, onConfirm, invoiceId }: DeleteModalProps) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>

            <div className="bg-white dark:bg-[#1e2139] p-8 md:p-12 rounded-lg max-w-[480px]">
                <h2 className="text-2xl font-bold text-[#0c0e16] dark:text-white mb-4">
                    Confirm Deletion
                </h2>

                <p className="text-[#888eb0] dark:text-[#dfe3fa] text-[13px] leading-6 mb-8">
                    Are you sure you want to delete invoice <span className="font-bold">#{invoiceId}</span>?
                    This action cannot be undone.
                </p>

                <div className="flex gap-2 justify-end">

                    <Button
                        variant="secondary"
                        onClick={onClose}
                        className="bg-[#f9fafe] dark:bg-[#252945] text-[#7e88c3] dark:text-[#dfe3fa] hover:bg-[#dfe3fa]"
                    >
                        Cancel
                    </Button>


                    <Button
                        variant="danger"
                        onClick={onConfirm}
                        className="bg-[#ec5757] hover:bg-[#ff9797] text-white"
                    >
                        Delete
                    </Button>
                </div>
            </div>
        </Modal>
    );
};