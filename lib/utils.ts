import { format } from 'date-fns';
import { Invoice, FilterState } from '@/types';

export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    }).format(amount);
};

export const formatDate = (date: string | Date): string => {
    return format(new Date(date), 'dd MMM yyyy');
};

export const generateInvoiceId = (): string => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomLetters = Array(2)
        .fill(null)
        .map(() => letters[Math.floor(Math.random() * letters.length)])
        .join('');
    const randomNumbers = Array(4)
        .fill(null)
        .map(() => Math.floor(Math.random() * 10))
        .join('');
    return `${randomLetters}${randomNumbers}`;
};

export const filterInvoices = (invoices: Invoice[], filters: FilterState): Invoice[] => {
    const activeFilters = Object.entries(filters)
        .filter(([_, value]) => value)
        .map(([key]) => key as keyof FilterState);

    if (activeFilters.length === 0) return invoices;

    return invoices.filter(invoice => activeFilters.includes(invoice.status));
};

export const calculatePaymentDue = (createdAt: string, paymentTerms: string): string => {
    const date = new Date(createdAt);
    date.setDate(date.getDate() + parseInt(paymentTerms, 10));
    return date.toISOString();
};