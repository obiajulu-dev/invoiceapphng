'use client';

import { InputProps } from '@/types';

export const Input = ({
    label,
    error,
    className = '',
    ...props
}: InputProps) => {
    return (
        <div className="form-group">
            {label && (
                <label className="block mb-2 text-sm font-medium text-[var(--text-secondary)]">
                    {label}
                </label>
            )}
            <input
                className={`
          w-full px-5 py-4 border rounded-md
          bg-[var(--bg-secondary)] 
          text-[var(--text-primary)]
          border-[var(--border-color)]
          focus:outline-none focus:border-[var(--accent-primary)]
          transition-colors duration-200
          ${error ? 'border-[var(--danger)]' : ''}
          ${className}
        `}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-[var(--danger)]">{error}</p>
            )}
        </div>
    );
};