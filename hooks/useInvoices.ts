import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Invoice, InvoiceFormData } from '@/types';
import { generateInvoiceId } from '@/lib/utils';
import { calculatePaymentDue } from '@/lib/utils';
import { calculateTotal } from '@/lib/validators';
import { useLocalStorage } from './useLocalStorage';

const STORAGE_KEY = 'invoiceapphng:invoices';

export const useInvoices = () => {
    const [invoices, setInvoices, isInitialized] = useLocalStorage<Invoice[]>(STORAGE_KEY, []);
    const [error, setError] = useState<string | null>(null);

    const createInvoice = async (invoiceData: InvoiceFormData): Promise<Invoice> => {
        const total = calculateTotal(invoiceData.items);
        const paymentDue = calculatePaymentDue(invoiceData.createdAt, invoiceData.paymentTerms);

        const newInvoice: Invoice = {
            id: invoiceData.id || generateInvoiceId(),
            clientName: invoiceData.clientName,
            clientEmail: invoiceData.clientEmail,
            clientAddress: invoiceData.clientAddress,
            clientCity: invoiceData.clientCity,
            clientPostCode: invoiceData.clientPostCode,
            clientCountry: invoiceData.clientCountry,
            createdAt: invoiceData.createdAt,
            paymentTerms: invoiceData.paymentTerms,
            paymentDue,
            description: invoiceData.description,
            items: invoiceData.items,
            total,
            status: invoiceData.status,
            updatedAt: new Date().toISOString(),
        };

        try {
            setInvoices(prev => [...prev, newInvoice]);
            toast.success('Invoice created successfully');
            return newInvoice;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to create invoice';
            setError(message);
            toast.error(message);
            throw error;
        }
    };

    const updateInvoice = async (id: string, invoiceData: Partial<Invoice>): Promise<Invoice> => {
        try {
            let updatedInvoice: Invoice | null = null;

            setInvoices(prev => prev.map(inv => {
                if (inv.id !== id) return inv;
                updatedInvoice = {
                    ...inv,
                    ...invoiceData,
                    updatedAt: new Date().toISOString(),
                } as Invoice;
                return updatedInvoice;
            }));

            if (!updatedInvoice) {
                throw new Error('Invoice not found');
            }

            toast.success('Invoice updated successfully');
            return updatedInvoice;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to update invoice';
            setError(message);
            toast.error(message);
            throw error;
        }
    };

    const deleteInvoice = async (id: string): Promise<boolean> => {
        try {
            let deleted = false;

            setInvoices(prev => {
                const filtered = prev.filter(inv => inv.id !== id);
                deleted = filtered.length !== prev.length;
                return filtered;
            });

            if (!deleted) {
                throw new Error('Invoice not found');
            }

            toast.success('Invoice deleted successfully');
            return true;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to delete invoice';
            setError(message);
            toast.error(message);
            throw error;
        }
    };

    const markAsPaid = async (id: string): Promise<Invoice> => {
        try {
            let updatedInvoice: Invoice | null = null;

            setInvoices(prev => prev.map(inv => {
                if (inv.id !== id) return inv;
                updatedInvoice = {
                    ...inv,
                    status: 'paid',
                    updatedAt: new Date().toISOString(),
                } as Invoice;
                return updatedInvoice;
            }));

            if (!updatedInvoice) {
                throw new Error('Invoice not found');
            }

            toast.success('Invoice marked as paid');
            return updatedInvoice;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to mark invoice as paid';
            setError(message);
            toast.error(message);
            throw error;
        }
    };

    useEffect(() => {
        if (!isInitialized) return;
    }, [isInitialized]);

    return {
        invoices,
        loading: !isInitialized,
        error,
        createInvoice,
        updateInvoice,
        deleteInvoice,
        markAsPaid,
        refetch: async () => {},
    };
};