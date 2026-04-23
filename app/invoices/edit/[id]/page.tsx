import { notFound } from 'next/navigation';
import { InvoiceForm } from '@/components/invoices/InvoiceForm';
import { getInvoiceById } from '@/lib/db';
import { Invoice } from '@/types';

interface EditInvoicePageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditInvoicePage({ params }: EditInvoicePageProps) {
    const { id } = await params;
    const invoice = await getInvoiceById(id);

    if (!invoice) {
        notFound();
    }

    return (
        <InvoiceForm mode="edit" initialData={invoice} />
    );
}
