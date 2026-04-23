'use client';

import { useState, useRef, useEffect } from 'react';
import { FilterState } from '@/types';

interface FilterComponentProps {
    filters: FilterState;
    onFilterChange: (filters: FilterState) => void;
}

export const FilterComponent = ({ filters, onFilterChange }: FilterComponentProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleCheckboxChange = (status: keyof FilterState) => {
        onFilterChange({ ...filters, [status]: !filters[status] });
    };

    const options: { label: string; value: keyof FilterState }[] = [
        { label: 'Draft', value: 'draft' },
        { label: 'Pending', value: 'pending' },
        { label: 'Paid', value: 'paid' },
    ];

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
                <span className="text-[15px] font-bold text-[#0c0e16] dark:text-white">
                    Filter <span className="hidden md:inline">by status</span>
                </span>
                <svg
                    width="10"
                    height="7"
                    className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                >
                    <path d="M1 1L5 5L9 1" stroke="#7C5DFA" strokeWidth="2" fill="none" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute top-10 left-1/2 -translate-x-1/2 w-48 bg-white dark:bg-[#252945] shadow-xl rounded-lg p-6 z-50 flex flex-col gap-4">
                    {options.map((option) => (
                        <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative flex items-center justify-center">
                                <input
                                    type="checkbox"
                                    checked={filters[option.value]}
                                    onChange={() => handleCheckboxChange(option.value)}
                                    className="peer appearance-none w-4 h-4 bg-[#dfe3fa] dark:bg-[#1e2139] border border-transparent rounded-sm checked:bg-[#7c5dfa] hover:border-[#7c5dfa] transition-all"
                                />
                                <svg
                                    width="10" height="8" viewBox="0 0 10 8" fill="none"
                                    className="absolute opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
                                >
                                    <path d="M1.5 4.5L3.83333 6.83333L8.5 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <span className="text-[15px] font-bold text-[#0c0e16] dark:text-white capitalize group-hover:text-[#7c5dfa] transition-colors">
                                {option.label}
                            </span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
};