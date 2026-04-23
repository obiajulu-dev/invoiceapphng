'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { StatusBadge } from './StatusBadge';
import { DeleteModal } from './DeleteModal';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useInvoices } from '@/hooks/useInvoices';
import { InvoiceDetailProps } from '@/types';

export const InvoiceDetail = ({ invoice }: InvoiceDetailProps) => {
    const router = useRouter();
    const { markAsPaid, deleteInvoice } = useInvoices();
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const handleMarkAsPaid = async (): Promise<void> => {
        setIsProcessing(true);
        try {
            await markAsPaid(invoice.id);
            router.refresh();
        } catch (error) {
            console.error('Failed to mark as paid:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDelete = async (): Promise<void> => {
        setIsProcessing(true);
        try {
            await deleteInvoice(invoice.id);
            router.push('/invoices');
        } catch (error) {
            console.error('Failed to delete invoice:', error);
        } finally {
            setIsProcessing(false);
            setShowDeleteModal(false);
        }
    };

    return (
        <div className="w-full">
            <Link
                href="/invoices"
                className="inline-flex items-center gap-6 mb-8 mt-8 md:mt-0 text-[15px] font-bold text-[var(--foreground)] hover:text-[#888eb0] transition-colors"
            >
                <svg width="7" height="10" viewBox="0 0 7 10" fill="none">
                    <path d="M6 9L2 5L6 1" stroke="currentColor" strokeWidth="2" />
                </svg>
                <span className="pt-1">Go back</span>
            </Link>

            <div className="bg-white dark:bg-[#1e2139] shadow-sm rounded-lg px-6 py-6 md:px-8 mb-6">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center justify-between w-full md:w-auto md:gap-4">
                        <span className="text-[13px] text-[var(--text-secondary)] font-medium">Status</span>
                        <StatusBadge status={invoice.status} />
                    </div>
                    <div className="hidden md:flex gap-2">
                        <Link href={`/invoices/edit/${invoice.id}`}>
                            <Button variant="secondary">Edit</Button>
                        </Link>
                        <Button
                            variant="danger"
                            onClick={() => setShowDeleteModal(true)}
                        >
                            Delete
                        </Button>
                        {invoice.status !== 'paid' && (
                            <Button
                                variant="primary"
                                onClick={handleMarkAsPaid}
                                disabled={isProcessing}
                            >
                                Mark as Paid
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-[#1e2139] shadow-sm rounded-lg p-6 md:p-12 mb-20">
                <div className="flex flex-col md:flex-row justify-between mb-12">
                    <div className="mb-8 md:mb-0">
                        <h2 className="text-[15px] font-bold text-[var(--foreground)] mb-2">
                            <span className="text-[#888eb0]">#</span>
                            {invoice.id}
                        </h2>
                        <p className="text-[13px] font-medium text-[var(--text-secondary)]">{invoice.description}</p>
                    </div>
                    <div className="text-left md:text-right text-[13px] font-medium text-[var(--text-secondary)] leading-relaxed">
                        <p>{invoice.clientAddress}</p>
                        <p>{invoice.clientCity}</p>
                        <p>{invoice.clientPostCode}</p>
                        <p>{invoice.clientCountry}</p>
                    </div>
                </div>

                <div className="flex flex-wrap md:grid md:grid-cols-3 gap-8 md:gap-0 mb-12">
                    <div className="w-1/2 md:w-auto">
                        <div className="mb-8">
                            <p className="text-[13px] text-[var(--text-secondary)] font-medium mb-3">Invoice Date</p>
                            <p className="font-bold text-[15px] text-[var(--foreground)]">{formatDate(invoice.createdAt)}</p>
                        </div>
                        <div>
                            <p className="text-[13px] text-[var(--text-secondary)] font-medium mb-3">Payment Due</p>
                            <p className="font-bold text-[15px] text-[var(--foreground)]">{formatDate(invoice.paymentDue)}</p>
                        </div>
                    </div>
                    <div className="w-1/2 md:w-auto">
                        <p className="text-[13px] text-[var(--text-secondary)] font-medium mb-3">Bill To</p>
                        <p className="font-bold text-[15px] text-[var(--foreground)] mb-2">{invoice.clientName}</p>
                        <div className="text-[13px] font-medium text-[var(--text-secondary)] leading-relaxed">
                            <p>{invoice.clientAddress}</p>
                            <p>{invoice.clientCity}</p>
                            <p>{invoice.clientPostCode}</p>
                            <p>{invoice.clientCountry}</p>
                        </div>
                    </div>
                    <div className="w-full md:w-auto mt-2 md:mt-0">
                        <p className="text-[13px] text-[var(--text-secondary)] font-medium mb-3">Sent to</p>
                        <p className="font-bold text-[15px] text-[var(--foreground)]">{invoice.clientEmail}</p>
                    </div>
                </div>

                <div className="bg-[#f9fafe] dark:bg-[#252945] rounded-lg overflow-hidden">
                    <div className="p-6 md:p-8">
                        <table className="w-full text-[13px]">
                            <thead className="hidden md:table-header-group">
                                <tr className="text-[var(--text-secondary)] font-medium">
                                    <th className="text-left pb-8 font-medium">Item Name</th>
                                    <th className="text-center pb-8 font-medium">QTY.</th>
                                    <th className="text-right pb-8 font-medium">Price</th>
                                    <th className="text-right pb-8 font-medium">Total</th>
                                </tr>
                            </thead>
                            <tbody className="flex flex-col gap-6 md:table-row-group md:gap-0">
                                {invoice.items.map((item, index) => (
                                    <tr key={index} className="flex justify-between items-center md:table-row mb-6 md:mb-0 last:mb-0 border-b border-transparent">
                                        <td className="font-bold text-[15px] text-[var(--foreground)] w-full md:py-4 md:w-auto">
                                            <div className="flex flex-col gap-2 md:block">
                                                <span>{item.name}</span>
                                                <span className="text-[var(--text-secondary)] md:hidden">
                                                    {item.quantity} x {formatCurrency(item.price)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="hidden md:table-cell text-center text-[var(--text-secondary)] font-bold md:py-4">
                                            {item.quantity}
                                        </td>
                                        <td className="hidden md:table-cell text-right text-[var(--text-secondary)] font-bold md:py-4">
                                            {formatCurrency(item.price)}
                                        </td>
                                        <td className="font-bold text-[15px] text-[var(--foreground)] text-right md:py-4">
                                            {formatCurrency(item.quantity * item.price)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="bg-[#373b53] dark:bg-[#0c0e16] p-6 md:px-8 py-6 flex justify-between items-center">
                        <span className="text-white text-[13px] font-medium pt-1">Amount Due</span>
                        <span className="text-white text-[24px] font-bold">
                            {formatCurrency(invoice.total)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Mobile Actions Bottom Bar */}
            <div className="md:hidden bg-white dark:bg-[#1e2139] p-6 flex justify-center gap-2 mt-4 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] w-full">
                <Link href={`/invoices/edit/${invoice.id}`}>
                    <Button variant="secondary">Edit</Button>
                </Link>
                <Button
                    variant="danger"
                    onClick={() => setShowDeleteModal(true)}
                >
                    Delete
                </Button>
                {invoice.status !== 'paid' && (
                    <Button
                        variant="primary"
                        onClick={handleMarkAsPaid}
                        disabled={isProcessing}
                    >
                        Mark as Paid
                    </Button>
                )}
            </div>

            <DeleteModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                invoiceId={invoice.id}
            />
        </div>
    );
};