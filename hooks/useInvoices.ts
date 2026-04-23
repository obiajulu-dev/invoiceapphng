import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Invoice, InvoiceFormData } from '@/types';

export const useInvoices = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchInvoices = useCallback(async (): Promise<void> => {
        try {
            setLoading(true);
            const response = await fetch('/api/invoices');
            const result = await response.json();

            if (result.success) {
                setInvoices(result.data);
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to fetch invoices';
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }, []);

    const createInvoice = async (invoiceData: InvoiceFormData): Promise<Invoice> => {
        try {
            const response = await fetch('/api/invoices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(invoiceData),
            });

            const result = await response.json();

            if (result.success) {
                setInvoices(prev => [...prev, result.data]);
                toast.success('Invoice created successfully');
                return result.data;
            } else {
                throw new Error(result.error || 'Validation failed');
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to create invoice';
            toast.error(message);
            throw error;
        }
    };

    const updateInvoice = async (id: string, invoiceData: Partial<Invoice>): Promise<Invoice> => {
        try {
            const response = await fetch(`/api/invoices/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(invoiceData),
            });

            const result = await response.json();

            if (result.success) {
                setInvoices(prev =>
                    prev.map(inv => inv.id === id ? result.data : inv)
                );
                toast.success('Invoice updated successfully');
                return result.data;
            } else {
                throw new Error(result.error || 'Update failed');
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to update invoice';
            toast.error(message);
            throw error;
        }
    };

    const deleteInvoice = async (id: string): Promise<boolean> => {
        try {
            const response = await fetch(`/api/invoices/${id}`, {
                method: 'DELETE',
            });

            const result = await response.json();

            if (result.success) {
                setInvoices(prev => prev.filter(inv => inv.id !== id));
                toast.success('Invoice deleted successfully');
                return true;
            } else {
                throw new Error(result.error || 'Delete failed');
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to delete invoice';
            toast.error(message);
            throw error;
        }
    };

    const markAsPaid = async (id: string): Promise<Invoice> => {
        try {
            const response = await fetch(`/api/invoices/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'markAsPaid' }),
            });

            const result = await response.json();

            if (result.success) {
                setInvoices(prev =>
                    prev.map(inv => inv.id === id ? result.data : inv)
                );
                toast.success('Invoice marked as paid');
                return result.data;
            } else {
                throw new Error(result.error || 'Failed to mark as paid');
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to mark invoice as paid';
            toast.error(message);
            throw error;
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, [fetchInvoices]);

    return {
        invoices,
        loading,
        error,
        createInvoice,
        updateInvoice,
        deleteInvoice,
        markAsPaid,
        refetch: fetchInvoices,
    };
};