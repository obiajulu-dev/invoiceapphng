import { Invoice, InvoiceItem, ValidationError } from '@/types';

export const validateInvoice = (invoice: Partial<Invoice>): { isValid: boolean; errors: ValidationError } => {
    const errors: ValidationError = {};

    // Client validation
    if (!invoice.clientName?.trim()) {
        errors.clientName = 'Client name is required';
    }

    if (!invoice.clientEmail?.trim()) {
        errors.clientEmail = 'Client email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(invoice.clientEmail)) {
        errors.clientEmail = 'Invalid email format';
    }

    // Invoice dates
    if (!invoice.createdAt) {
        errors.createdAt = 'Invoice date is required';
    }

    if (!invoice.paymentTerms) {
        errors.paymentTerms = 'Payment terms are required';
    }

    // Items validation
    if (!invoice.items || invoice.items.length === 0) {
        errors.items = 'At least one item is required';
    } else {
        invoice.items.forEach((item: InvoiceItem, index: number) => {
            if (!item.name?.trim()) {
                errors[`items[${index}].name`] = 'Item name is required';
            }
            if (!item.quantity || item.quantity <= 0) {
                errors[`items[${index}].quantity`] = 'Quantity must be a positive number';
            }
            if (!item.price || item.price <= 0) {
                errors[`items[${index}].price`] = 'Price must be a positive number';
            }
        });
    }

    // Status validation
    if (invoice.status && !['draft', 'pending', 'paid'].includes(invoice.status)) {
        errors.status = 'Invalid status';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

export const calculateTotal = (items: InvoiceItem[]): number => {
    return items.reduce((total: number, item: InvoiceItem) => {
        return total + (item.quantity * item.price);
    }, 0);
};