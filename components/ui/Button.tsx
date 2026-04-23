'use client';

import { ButtonProps } from '@/types';

export const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    onClick,
    disabled = false,
    type = 'button',
    className = '',
    ...props
}: ButtonProps) => {
    const baseStyles = 'inline-flex items-center justify-center font-bold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-primary)] disabled:opacity-50 disabled:cursor-not-allowed';

    const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
        primary: 'bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-hover)]',
        secondary: 'bg-[#f9fafe] dark:bg-[#252945] text-[var(--text-secondary)] dark:text-[var(--text-primary)] hover:bg-[var(--border-color)]',
        danger: 'bg-[var(--danger)] text-white hover:bg-[var(--danger-hover)]',
        ghost: 'bg-transparent text-[var(--text-secondary)] hover:bg-[var(--border-color)]',
    };

    const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};