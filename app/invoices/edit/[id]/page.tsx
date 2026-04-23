'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { InvoiceForm } from '@/components/invoices/InvoiceForm';
import { useInvoices } from '@/hooks/useInvoices';

export default function EditInvoicePage() {
    const params = useParams();
    const invoiceId = params?.id;
    const { invoices, loading } = useInvoices();

    const invoice = useMemo(
        () => invoices.find(inv => inv.id === invoiceId),
        [invoices, invoiceId]
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-primary)]" />
            </div>
        );
    }

    if (!invoice) {
        return (
            <div className="py-8 text-center text-[var(--foreground)]">
                Invoice not found.
            </div>
        );
    }

    return <InvoiceForm mode="edit" initialData={invoice} />;
}
