'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useInvoices } from '@/hooks/useInvoices';
import { StatusBadge } from './StatusBadge';
import { FilterComponent } from './FilterComponent';
import { EmptyState } from './EmptyState';
import { formatCurrency, formatDate, filterInvoices } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { FilterState } from '@/types';

export const InvoiceList = () => {
    const { invoices, loading } = useInvoices();
    const [filters, setFilters] = useState<FilterState>({
        draft: false,
        pending: false,
        paid: false,
    });

    const filteredInvoices = filterInvoices(invoices, filters);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-primary)]" />
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-16 mt-8 md:mt-0">
                <div>
                    <h1 className="text-[32px] md:text-[36px] font-bold tracking-[-1px] text-[var(--foreground)]">Invoices</h1>
                    <p className="text-[13px] text-[var(--text-secondary)] mt-1 md:mt-2 font-medium">
                        {filteredInvoices.length === 0
                            ? 'No invoices'
                            : `There are ${filteredInvoices.length} total invoices`}
                    </p>
                </div>
                <div className="flex items-center gap-4 md:gap-10">
                    <FilterComponent filters={filters} onFilterChange={setFilters} />
                    <Link href="/invoices/create">
                        <Button variant="primary" className="p-2 pr-4 pl-2 flex items-center gap-2 md:gap-4 h-12 rounded-full">
                            <div className="bg-white rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                                <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.31311 10.0234V6.31311H10.0234V4.68689H6.31311V0.976562H4.68689V4.68689H0.976562V6.31311H4.68689V10.0234H6.31311Z" fill="#7C5DFA" />
                                </svg>
                            </div>
                            <span className="font-bold text-[15px] hidden md:inline pb-[2px]">New Invoice</span>
                            <span className="font-bold text-[15px] md:hidden pb-[2px]">New</span>
                        </Button>
                    </Link>
                </div>
            </div>

            {filteredInvoices.length === 0 ? (
                <EmptyState />
            ) : (
                <div className="flex flex-col gap-4">
                    {filteredInvoices.map((invoice) => (
                        <Link
                            key={invoice.id}
                            href={`/invoices/${invoice.id}`}
                            className="flex w-full flex-col md:flex-row md:items-center bg-white dark:bg-[#1e2139] shadow-sm rounded-lg p-6 md:px-8 md:py-4 border border-transparent hover:border-[#7c5dfa] transition-colors gap-4 md:gap-0"
                        >
                            <div className="flex items-center justify-between md:justify-start md:w-1/2 md:gap-12">
                                <span className="font-bold text-[15px] text-[var(--foreground)] w-20">
                                    <span className="text-[#888eb0]">#</span>
                                    {invoice.id}
                                </span>
                                <span className="text-[13px] text-[var(--text-secondary)] font-medium w-32">
                                    Due {formatDate(invoice.paymentDue)}
                                </span>
                                <span className="text-[13px] text-[#858bb2] dark:text-white font-medium hidden md:block">
                                    {invoice.clientName}
                                </span>
                            </div>
                            <div className="flex items-center justify-between md:w-1/2 md:justify-end">
                                <div className="flex flex-col md:hidden gap-1">
                                    <span className="text-[13px] text-[#858bb2] dark:text-white font-medium">
                                        {invoice.clientName}
                                    </span>
                                    <span className="font-bold text-[15px] text-[var(--foreground)]">
                                        {formatCurrency(invoice.total)}
                                    </span>
                                </div>
                                <span className="font-bold text-[15px] md:text-lg text-[var(--foreground)] hidden md:block md:mr-10">
                                    {formatCurrency(invoice.total)}
                                </span>
                                <div className="flex items-center gap-4">
                                    <StatusBadge status={invoice.status} />
                                    <svg width="7" height="10" viewBox="0 0 7 10" fill="none" className="hidden md:block ml-2">
                                        <path d="M1 1L5 5L1 9" stroke="#7C5DFA" strokeWidth="2" />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};