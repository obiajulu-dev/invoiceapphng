import fs from 'fs/promises';
import path from 'path';
import { Invoice } from '@/types';

const DB_PATH = path.join(process.cwd(), 'data', 'invoices.json');

interface Database {
    invoices: Invoice[];
}

const ensureDb = async (): Promise<void> => {
    try {
        await fs.access(path.join(process.cwd(), 'data'));
    } catch {
        await fs.mkdir(path.join(process.cwd(), 'data'));
    }

    try {
        await fs.access(DB_PATH);
    } catch {
        await fs.writeFile(DB_PATH, JSON.stringify({ invoices: [] }, null, 2));
    }
};

export const readInvoices = async (): Promise<Database> => {
    await ensureDb();
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data) as Database;
};

export const writeInvoices = async (data: Database): Promise<void> => {
    await ensureDb();
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
};

export const getInvoices = async (): Promise<Invoice[]> => {
    const db = await readInvoices();
    return db.invoices;
};

export const getInvoiceById = async (id: string): Promise<Invoice | undefined> => {
    const db = await readInvoices();
    return db.invoices.find(invoice => invoice.id === id);
};

import { generateInvoiceId } from '@/lib/utils';

export const createInvoice = async (invoiceData: Partial<Invoice>): Promise<Invoice> => {
    const db = await readInvoices();
    const newInvoice: Invoice = {
        id: generateInvoiceId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...invoiceData,
    } as Invoice;

    db.invoices.push(newInvoice);
    await writeInvoices(db);
    return newInvoice;
};

export const updateInvoice = async (id: string, invoiceData: Partial<Invoice>): Promise<Invoice | null> => {
    const db = await readInvoices();
    const index = db.invoices.findIndex(invoice => invoice.id === id);

    if (index === -1) return null;

    const updatedInvoice: Invoice = {
        ...db.invoices[index],
        ...invoiceData,
        updatedAt: new Date().toISOString(),
    };

    db.invoices[index] = updatedInvoice;
    await writeInvoices(db);
    return updatedInvoice;
};

export const deleteInvoice = async (id: string): Promise<boolean> => {
    const db = await readInvoices();
    const filtered = db.invoices.filter(invoice => invoice.id !== id);

    if (filtered.length === db.invoices.length) return false;

    db.invoices = filtered;
    await writeInvoices(db);
    return true;
};