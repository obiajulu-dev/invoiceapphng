'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { validateInvoice, calculateTotal } from '@/lib/validators';
import { generateInvoiceId, formatCurrency } from '@/lib/utils';
import { useInvoices } from '@/hooks/useInvoices';
import { InvoiceFormProps, InvoiceItem, ValidationError } from '@/types';

export const InvoiceForm = ({ initialData = null, mode }: InvoiceFormProps) => {
    const router = useRouter();
    const { createInvoice, updateInvoice } = useInvoices();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [errors, setErrors] = useState<ValidationError>({});

    const [formData, setFormData] = useState({
        id: initialData?.id || generateInvoiceId(),
        clientName: initialData?.clientName || '',
        clientEmail: initialData?.clientEmail || '',
        clientAddress: initialData?.clientAddress || '',
        clientCity: initialData?.clientCity || '',
        clientPostCode: initialData?.clientPostCode || '',
        clientCountry: initialData?.clientCountry || '',
        createdAt: initialData?.createdAt || new Date().toISOString().split('T')[0],
        paymentTerms: initialData?.paymentTerms || '30',
        description: initialData?.description || '',
        items: initialData?.items || [{ name: '', quantity: 1, price: 0 }],
        status: initialData?.status || 'pending',
    });

    const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number): void => {
        const newItems = [...formData.items];
        newItems[index] = {
            ...newItems[index],
            [field]: field === 'name' ? value : parseFloat(value as string) || 0
        };
        setFormData({ ...formData, items: newItems });
    };

    const addItem = (): void => {
        setFormData({
            ...formData,
            items: [...formData.items, { name: '', quantity: 1, price: 0 }],
        });
    };

    const removeItem = (index: number): void => {
        if (formData.items.length > 1) {
            const newItems = formData.items.filter((_, i) => i !== index);
            setFormData({ ...formData, items: newItems });
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>, saveAsDraft: boolean = false): Promise<void> => {
        e.preventDefault();

        const dataToValidate = {
            ...formData,
            status: saveAsDraft ? 'draft' : formData.status,
        };

        const validation = validateInvoice(dataToValidate);

        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }

        setIsSubmitting(true);
        setErrors({});

        try {
            const submitData = {
                ...dataToValidate,
                total: calculateTotal(formData.items),
            };

            if (mode === 'create') {
                await createInvoice(submitData);
            } else if (initialData) {
                await updateInvoice(initialData.id, submitData);
            }

            router.push('/invoices');
        } catch (error) {
            console.error('Failed to save invoice:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const total = calculateTotal(formData.items);

    return (
        <div className="fixed inset-0 z-30 flex">
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/50 transition-opacity"
                onClick={() => router.back()}
            />

            {/* Drawer */}
            <div className="relative w-full md:max-w-[790px] max-w-md h-full bg-white dark:bg-[#141625] flex flex-col md:pl-[103px] rounded-r-3xl md:rounded-r-[20px] shadow-[0_10px_20px_rgba(0,0,0,0.1)] pt-[72px] md:pt-0">
                <form onSubmit={(e) => handleSubmit(e, false)} className="flex flex-col flex-1 h-full overflow-hidden">

                    <div className="p-6 md:p-14 flex-1 overflow-y-auto">
                        <h2 className="text-[24px] font-bold text-[var(--foreground)] mb-12">
                            {mode === 'create' ? 'New Invoice' : <>Edit <span className="text-[#888eb0]">#</span>{formData.id}</>}
                        </h2>

                        {/* Bill From Section */}
                        <fieldset className="mb-12 border-none p-0 m-0">
                            <legend className="text-[15px] text-[var(--accent-primary)] font-bold mb-6">
                                Bill From
                            </legend>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-3">
                                    <Input
                                        label="Street Address"
                                        value={formData.clientAddress} // We keep this generic if it was editable, the previous version had it hardcoded
                                        onChange={(e) => setFormData({ ...formData, clientAddress: e.target.value })}
                                    />
                                </div>
                                <Input
                                    label="City"
                                    value={formData.clientCity}
                                    onChange={(e) => setFormData({ ...formData, clientCity: e.target.value })}
                                />
                                <Input
                                    label="Post Code"
                                    value={formData.clientPostCode}
                                    onChange={(e) => setFormData({ ...formData, clientPostCode: e.target.value })}
                                />
                                <Input
                                    label="Country"
                                    value={formData.clientCountry}
                                    onChange={(e) => setFormData({ ...formData, clientCountry: e.target.value })}
                                />
                            </div>
                        </fieldset>

                        {/* Bill To Section */}
                        <fieldset className="mb-12 border-none p-0 m-0">
                            <legend className="text-[15px] text-[var(--accent-primary)] font-bold mb-6">
                                Bill To
                            </legend>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-3">
                                    <Input
                                        label="Client's Name"
                                        value={formData.clientName}
                                        onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                                        error={errors.clientName}
                                        required
                                    />
                                </div>
                                <div className="md:col-span-3">
                                    <Input
                                        label="Client's Email"
                                        type="email"
                                        value={formData.clientEmail}
                                        onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                                        error={errors.clientEmail}
                                        required
                                    />
                                </div>
                                <div className="md:col-span-3">
                                    <Input
                                        label="Street Address"
                                        value={formData.clientAddress}
                                        onChange={(e) => setFormData({ ...formData, clientAddress: e.target.value })}
                                    />
                                </div>
                                <Input
                                    label="City"
                                    value={formData.clientCity}
                                    onChange={(e) => setFormData({ ...formData, clientCity: e.target.value })}
                                />
                                <Input
                                    label="Post Code"
                                    value={formData.clientPostCode}
                                    onChange={(e) => setFormData({ ...formData, clientPostCode: e.target.value })}
                                />
                                <Input
                                    label="Country"
                                    value={formData.clientCountry}
                                    onChange={(e) => setFormData({ ...formData, clientCountry: e.target.value })}
                                />
                            </div>
                        </fieldset>

                        {/* Invoice Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <Input
                                label="Invoice Date"
                                type="date"
                                value={formData.createdAt}
                                onChange={(e) => setFormData({ ...formData, createdAt: e.target.value })}
                                error={errors.createdAt}
                                required
                            />
                            <div>
                                <label className="block mb-2 text-[13px] font-medium text-[#7e88c3] dark:text-[#dfe3fa]">
                                    Payment Terms
                                </label>
                                <select
                                    value={formData.paymentTerms}
                                    onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                                    className="w-full px-5 py-[14px] font-bold text-[15px] border rounded-[4px] bg-white dark:bg-[#1e2139] text-[var(--foreground)] border-[var(--border-color)] focus:outline-none focus:border-[var(--accent-primary)] appearance-none"
                                    required
                                >
                                    <option value="1">Net 1 Day</option>
                                    <option value="7">Net 7 Days</option>
                                    <option value="14">Net 14 Days</option>
                                    <option value="30">Net 30 Days</option>
                                </select>
                            </div>
                        </div>

                        <div className="mb-12">
                            <Input
                                label="Project Description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        {/* Items List */}
                        <div>
                            <h3 className="text-[18px] font-bold mb-6 text-[#777f98]">
                                Item List
                            </h3>

                            {errors.items && (
                                <p className="text-[var(--danger)] text-[13px] font-medium mb-4">{errors.items}</p>
                            )}

                            <div className="space-y-6">
                                {formData.items.map((item, index) => (
                                    <div key={index} className="grid grid-cols-12 gap-3 items-start">
                                        <div className="col-span-12 md:col-span-4">
                                            <Input
                                                label={index === 0 ? "Item Name" : ""}
                                                value={item.name}
                                                onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                                                error={errors[`items[${index}].name`]}
                                                required
                                            />
                                        </div>
                                        <div className="col-span-3 md:col-span-2">
                                            <Input
                                                label={index === 0 ? "Qty." : ""}
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                                error={errors[`items[${index}].quantity`]}
                                                required
                                            />
                                        </div>
                                        <div className="col-span-4 md:col-span-3">
                                            <Input
                                                label={index === 0 ? "Price" : ""}
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={item.price}
                                                onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                                                error={errors[`items[${index}].price`]}
                                                required
                                            />
                                        </div>
                                        <div className="col-span-3 md:col-span-2">
                                            {index === 0 && (
                                                <div className="block mb-2 text-[13px] font-medium text-[var(--text-secondary)]">Total</div>
                                            )}
                                            <div className="py-4 text-[var(--text-secondary)] font-bold text-[15px]">
                                                {formatCurrency(item.quantity * item.price)}
                                            </div>
                                        </div>
                                        <div className="col-span-2 md:col-span-1 flex items-center justify-center">
                                            {index === 0 && <div className="block mb-2 invisible">Action</div>}
                                            <button
                                                type="button"
                                                onClick={() => removeItem(index)}
                                                className="text-[#888eb0] hover:text-[var(--danger)] transition-colors p-2"
                                                aria-label="Remove item"
                                            >
                                                <svg width="13" height="16" viewBox="0 0 13 16" fill="currentColor">
                                                    <path d="M11.583 3.833v9.667c0 .917-.75 1.667-1.666 1.667H3.083c-.916 0-1.666-.75-1.666-1.667V3.833h10.166ZM4.75 13h.916V5.667H4.75V13Zm2.584 0h.916V5.667h-.916V13ZM1.5 1.167h10l-.917-1.167h-8.25L1.5 1.167Zm9.167 1.5H2.333V2.667h8.334v-1.5Z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Button
                                type="button"
                                onClick={addItem}
                                className="mt-6 w-full bg-[#f9fafe] dark:bg-[#252945] hover:bg-[#dfe3fa] dark:hover:bg-[#1e2139] text-[#7e88c3] dark:text-[#dfe3fa] font-bold text-[15px] h-12 rounded-full transition-colors"
                            >
                                + Add New Item
                            </Button>
                        </div>
                    </div>

                    {/* Form Actions (Sticky Footer) */}
                    <div className="p-6 md:px-14 md:py-8 bg-white dark:bg-[#141625] shadow-[0_-10px_20px_rgba(0,0,0,0.05)] rounded-br-3xl md:rounded-none md:rounded-br-[20px] flex items-center justify-between z-10">
                        {mode === 'create' ? (
                            <>
                                <Button
                                    type="button"
                                    onClick={() => router.back()}
                                    className="bg-[#f9fafe] dark:bg-[#252945] hover:bg-[#dfe3fa] dark:hover:bg-[#1e2139] text-[#7e88c3] dark:text-[#dfe3fa] font-bold text-[15px] px-6 h-12 rounded-full transition-colors"
                                >
                                    Discard
                                </Button>
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        onClick={(e) => handleSubmit(e as any, true)}
                                        disabled={isSubmitting}
                                        className="bg-[#373b53] hover:bg-[#0c0e16] text-[#888eb0] dark:text-[#dfe3fa] font-bold text-[15px] px-4 md:px-6 h-12 rounded-full transition-colors"
                                    >
                                        Save as Draft
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        disabled={isSubmitting}
                                        className="font-bold text-[15px] px-6 h-12 rounded-full"
                                    >
                                        {isSubmitting ? 'Saving...' : 'Save & Send'}
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex-1" />
                                <div className="flex gap-2 justify-end w-full">
                                    <Button
                                        type="button"
                                        onClick={() => router.back()}
                                        className="bg-[#f9fafe] dark:bg-[#252945] hover:bg-[#dfe3fa] dark:hover:bg-[#1e2139] text-[#7e88c3] dark:text-[#dfe3fa] font-bold text-[15px] px-6 h-12 rounded-full transition-colors"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        disabled={isSubmitting}
                                        className="font-bold text-[15px] px-6 h-12 rounded-full"
                                    >
                                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};