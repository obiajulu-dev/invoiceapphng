import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { EmptyStateProps } from '@/types';

export const EmptyState = ({ message }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center text-center mt-[100px] md:mt-[150px]">
      <img
        src="/images/illustration-empty.png"
        alt="No invoices"
        className="mx-auto mb-16 w-full max-w-[240px]"
      />
      <h2 className="text-2xl md:text-[24px] font-bold text-[var(--foreground)] tracking-[-0.75px] mb-6">There is nothing here</h2>
      <p className="text-[13px] text-[var(--text-secondary)] max-w-[220px] font-medium leading-relaxed">
        {message || (
          <>
            Create an invoice by clicking the <br />
            <strong>New Invoice</strong> button and get started
          </>
        )}
      </p>
    </div>
  );
};