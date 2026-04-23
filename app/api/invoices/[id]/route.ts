import { NextRequest, NextResponse } from 'next/server';
import { getInvoiceById, updateInvoice, deleteInvoice } from '@/lib/db';
import { validateInvoice, calculateTotal } from '@/lib/validators';
import { calculatePaymentDue } from '@/lib/utils';
import { ApiResponse, Invoice } from '@/types';

type RouteParams = {
    params: Promise<{
        id: string;
    }>;
};

export async function GET(
    request: NextRequest,
    { params }: RouteParams
): Promise<NextResponse<ApiResponse<Invoice>>> {
    try {
        const { id } = await params;
        const invoice = await getInvoiceById(id);

        if (!invoice) {
            return NextResponse.json(
                { success: false, error: 'Invoice not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: invoice });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: RouteParams
): Promise<NextResponse<ApiResponse<Invoice>>> {
    try {
        const { id } = await params;
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
            total: calculateTotal(body.items),
            paymentDue: calculatePaymentDue(body.createdAt, body.paymentTerms),
        };

        const updatedInvoice = await updateInvoice(id, invoiceData);

        if (!updatedInvoice) {
            return NextResponse.json(
                { success: false, error: 'Invoice not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: updatedInvoice });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: RouteParams
): Promise<NextResponse<ApiResponse<never>>> {
    try {
        const { id } = await params;
        const deleted = await deleteInvoice(id);

        if (!deleted) {
            return NextResponse.json(
                { success: false, error: 'Invoice not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: RouteParams
): Promise<NextResponse<ApiResponse<Invoice>>> {
    try {
        const { id } = await params;
        const body = await request.json() as { action: string };
        const invoice = await getInvoiceById(id);

        if (!invoice) {
            return NextResponse.json(
                { success: false, error: 'Invoice not found' },
                { status: 404 }
            );
        }

        // Special handling for marking as paid
        if (body.action === 'markAsPaid') {
            if (invoice.status === 'draft') {
                return NextResponse.json(
                    { success: false, error: 'Draft invoices cannot be marked as paid' },
                    { status: 400 }
                );
            }

            const updatedInvoice = await updateInvoice(id, {
                status: 'paid',
            });

            if (!updatedInvoice) {
                return NextResponse.json(
                    { success: false, error: 'Failed to update invoice' },
                    { status: 500 }
                );
            }

            return NextResponse.json({ success: true, data: updatedInvoice });
        }

        return NextResponse.json(
            { success: false, error: 'Invalid action' },
            { status: 400 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}