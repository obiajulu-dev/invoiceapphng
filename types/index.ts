export type InvoiceStatus = 'draft' | 'pending' | 'paid';

export interface InvoiceItem {
    id?: string;
    name: string;
    quantity: number;
    price: number;
    total?: number;
}

export interface Address {
    street: string;
    city: string;
    postCode: string;
    country: string;
}

export interface Invoice {
    id: string;
    clientName: string;
    clientEmail: string;
    clientAddress: string;
    clientCity: string;
    clientPostCode: string;
    clientCountry: string;
    createdAt: string;
    paymentTerms: string;
    paymentDue: string;
    description: string;
    items: InvoiceItem[];
    total: number;
    status: InvoiceStatus;
    senderAddress?: Address;
    updatedAt?: string;
}

export interface InvoiceFormData extends Omit<Invoice, 'id' | 'total' | 'paymentDue'> {
    id?: string;
    items: InvoiceItem[];
}

export interface FilterState {
    draft: boolean;
    pending: boolean;
    paid: boolean;
}

export interface ValidationError {
    [key: string]: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    errors?: ValidationError;
}

export type Theme = 'light' | 'dark';

export interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    isInitialized: boolean;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
}

export interface StatusBadgeProps {
    status: InvoiceStatus;
}

export interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    invoiceId: string;
}

export interface FilterComponentProps {
    filters: FilterState;
    onFilterChange: (filters: FilterState) => void;
}

export interface InvoiceFormProps {
    initialData?: Invoice | null;
    mode: 'create' | 'edit';
}

export interface InvoiceDetailProps {
    invoice: Invoice;
}

export interface EmptyStateProps {
    message?: string;
}

export interface InvoiceItemRowProps {
    item: InvoiceItem;
    index: number;
    onUpdate: (index: number, field: keyof InvoiceItem, value: string | number) => void;
    onRemove: (index: number) => void;
    errors?: ValidationError;
    showLabels?: boolean;
}