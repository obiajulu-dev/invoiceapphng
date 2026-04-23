'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { InvoiceDetail } from '@/components/invoices/InvoiceDetail';
import { useInvoices } from '@/hooks/useInvoices';

export default function InvoiceDetailPage() {
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

    return (
        <div className="py-8 md:py-12">
            <InvoiceDetail invoice={invoice} />
        </div>
    );
}
