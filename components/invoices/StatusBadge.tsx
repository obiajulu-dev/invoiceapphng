import { StatusBadgeProps, InvoiceStatus } from '@/types';

export const StatusBadge = ({ status }: StatusBadgeProps) => {
    const statusConfig: Record<InvoiceStatus, { label: string; className: string }> = {
        paid: {
            label: 'Paid',
            className: 'bg-[var(--success-bg)] text-[var(--success)]',
        },
        pending: {
            label: 'Pending',
            className: 'bg-[var(--pending-bg)] text-[var(--pending)]',
        },
        draft: {
            label: 'Draft',
            className: 'bg-[var(--draft-bg)] text-[var(--draft)]',
        },
    };

    const config = statusConfig[status] || statusConfig.draft;

    return (
        <span className={`
      inline-flex items-center gap-2 px-4 py-2 rounded-md
      font-bold text-sm capitalize min-w-[104px] justify-center
      ${config.className}
    `}>
            <span className={`w-2 h-2 rounded-full bg-current`} />
            {config.label}
        </span>
    );
};