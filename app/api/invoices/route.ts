import { NextRequest, NextResponse } from 'next/server';
import { getInvoices, createInvoice } from '@/lib/db';
import { validateInvoice, calculateTotal } from '@/lib/validators';
import { calculatePaymentDue, generateInvoiceId } from '@/lib/utils';
import { ApiResponse, Invoice } from '@/types';

export async function GET(): Promise<NextResponse<ApiResponse<Invoice[]>>> {
    try {
        const invoices = await getInvoices();
        return NextResponse.json({ success: true, data: invoices });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<Invoice>>> {
    try {
        const body = await request.json();

        // Validate invoice data
        const validation = validateInvoice(body);
        if (!validation.isValid) {
            return NextResponse.json(
                { success: false, errors: validation.errors },
                { status: 400 }
            );
        }

        const invoiceData = {
            ...body,
            id: body.id || generateInvoiceId(),
            total: calculateTotal(body.items),
            paymentDue: calculatePaymentDue(body.createdAt, body.paymentTerms),
        };

        const newInvoice = await createInvoice(invoiceData);
        return NextResponse.json(
            { success: true, data: newInvoice },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}