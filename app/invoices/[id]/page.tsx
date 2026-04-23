import { notFound } from 'next/navigation';
import { InvoiceDetail } from '@/components/invoices/InvoiceDetail';
import { Invoice } from '@/types';

import { getInvoiceById } from '@/lib/db';

interface InvoiceDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

async function getInvoice(id: string): Promise<Invoice | null> {
    try {
        const invoice = await getInvoiceById(id);
        return invoice || null;
    } catch (error) {
        console.error('Error fetching invoice:', error);
        return null;
    }
}

export default async function InvoiceDetailPage({ params }: InvoiceDetailPageProps) {
    const { id } = await params;
    const invoice = await getInvoice(id);

    if (!invoice) {
        notFound();
    }

    return (
        <div className="py-8 md:py-12">
            <InvoiceDetail invoice={invoice} />
        </div>
    );
}