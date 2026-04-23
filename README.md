# 🧾 Invoice App — Client-First Invoice Management

A modern, lightweight invoice management system built with Next.js 16 and TypeScript, designed for seamless client-side data persistence with zero server storage dependencies.


---

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Architecture Overview](#architecture-overview)
- [System Design](#system-design)
- [Trade-offs & Design Decisions](#trade-offs--design-decisions)
- [Accessibility & Compliance](#accessibility--compliance)
- [Beyond Requirements](#beyond-requirements)
- [Browser Support](#browser-support)

---

## 🚀 Quick Start

### Prerequisites

- **Node.js**: v18.17 or higher
- **npm**: v9+ (or yarn/pnpm/bun)
- **Modern browser**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+

### Installation

```bash
# Clone the repository
git clone https://github.com/obiajulu-dev/invoiceapphng.git
cd invoiceapphng

# Install dependencies
npm install

# Start development server
npm run dev

# Navigate to http://localhost:3000
```

### Production Build

```bash
# Build optimized production bundle
npm run build

# Start production server
npm start

# Or deploy directly to Vercel/serverless platforms
vercel deploy
```

### Environment Setup

No environment files required — the app works out of the box. Optional configuration via `.env.local`:

```env
# Optional: Configure Next.js behavior
NEXT_PUBLIC_APP_NAME=InvoiceApp
```

---

## 🏗️ Architecture Overview

### High-Level Structure

```
invoiceapphng/
├── app/                         # Next.js 16 App Router
│   ├── api/invoices/           # API routes (optional, kept for reference)
│   ├── invoices/               # Page routes
│   │   ├── [id]/page.tsx       # Invoice detail (client-side)
│   │   ├── edit/[id]/page.tsx  # Invoice editor (client-side)
│   │   ├── create/page.tsx     # Invoice creation
│   │   └── page.tsx            # Invoices list & dashboard
│   ├── layout.tsx              # Root layout w/ providers
│   ├── globals.css             # Tailwind styles
│   └── page.tsx                # Home page
├── components/                  # Reusable React components
│   ├── invoices/               # Invoice-domain components
│   │   ├── InvoiceForm.tsx     # Form w/ validation & items editor
│   │   ├── InvoiceList.tsx     # Paginated list w/ filters
│   │   ├── InvoiceDetail.tsx   # Full invoice view & actions
│   │   ├── DeleteModal.tsx     # Confirmation modal
│   │   ├── FilterComponent.tsx # Status filter UI
│   │   ├── StatusBadge.tsx     # Invoice status indicator
│   │   └── EmptyState.tsx      # Zero-state UI
│   ├── layout/                 # Global layout components
│   │   ├── Header.tsx          # App header & navigation
│   │   ├── Providers.tsx       # Client providers (toast, theme)
│   │   └── ThemeToggle.tsx     # Dark mode switcher
│   └── ui/                     # Atomic UI components
│       ├── Button.tsx          # Polymorphic button
│       ├── Input.tsx           # Labeled input field
│       ├── Card.tsx            # Card container
│       ├── Modal.tsx           # Modal dialog
│       └── Select.tsx          # Select dropdown
├── contexts/                    # React Context providers
│   └── ThemeContext.tsx        # Dark/light theme state
├── hooks/                       # Custom React hooks
│   ├── useInvoices.ts          # Invoice CRUD + localStorage sync
│   ├── useLocalStorage.ts      # Browser localStorage wrapper
│   └── useTheme.ts             # Theme context consumer
├── lib/                         # Business logic & utilities
│   ├── utils.ts                # Formatters, ID generation, filtering
│   ├── validators.ts           # Invoice schema validation
│   └── db.ts                   # [DEPRECATED] Server-side db layer
├── types/                       # TypeScript type definitions
│   └── index.ts                # Shared interfaces
└── public/                      # Static assets
```

### Data Flow Diagram

```
User Interaction
    ↓
React Component (InvoiceForm, InvoiceDetail, etc.)
    ↓
useInvoices Hook (CRUD operations)
    ↓
setInvoices State Update (React state)
    ↓
useLocalStorage Hook (browser storage sync)
    ↓
window.localStorage (persistent storage)
    ↓
Toast Notifications & Router Navigation
```

### Core Technologies

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 16 + App Router | Server/client routing, SSR support |
| **Language** | TypeScript 5 | Type safety, IDE autocompletion |
| **Styling** | Tailwind CSS + CSS Variables | Responsive design, dark mode support |
| **State** | React Hooks + Context | Client-side state management |
| **Storage** | localStorage API | Per-user invoice persistence |
| **Validation** | Custom validators + types | Runtime data integrity |
| **UI Feedback** | React Hot Toast | Non-blocking notifications |
| **Date Handling** | date-fns | Timezone-aware date formatting |

---

## 🎯 System Design

### 1. **Client-First State Management**

The app uses a **hook-based state management** pattern without Redux or MobX:

```typescript
const { invoices, loading, error, createInvoice, updateInvoice, deleteInvoice, markAsPaid } = useInvoices();
```

**Why this approach?**
- Minimal dependencies → smaller bundle size (fewer imports)
- localStorage integration baked into custom hooks
- Bidirectional sync: React state ↔ localStorage
- Automatic hydration on component mount

### 2. **localStorage Synchronization**

The `useLocalStorage` hook provides a custom storage layer:

```typescript
const [invoices, setInvoices, isInitialized] = useLocalStorage<Invoice[]>(
  'invoiceapphng:invoices',
  []  // Default: empty array for new users
);
```

**Key features:**
- Atomic writes: all state changes immediately persist to storage
- Initialization flag: prevents hydration mismatches
- Error handling: silent failures with console logging (non-blocking)
- Type-safe: full TypeScript support with generics

### 3. **Form Validation Pipeline**

Validation occurs at two stages:

```
User Input
  ↓ (Client-side validation in useInvoices)
validateInvoice() → ValidationError[]
  ↓ (Set errors in form state)
User sees errors
  ↓ (User fixes & resubmits)
Success toast + Navigation
```

**Validators check:**
- Required fields (client name, email, items)
- Email format (RFC 5322)
- Item quantities ≥ 1
- Positive prices
- At least 1 line item

### 4. **Theme Context: Dark Mode**

A React Context provides theme switching with localStorage:

```typescript
// In components:
const { theme, toggleTheme } = useTheme();

// Automatically persists preference:
localStorage.setItem('theme', newTheme);
```

CSS variables toggle based on `data-theme` attribute:

```css
:root[data-theme="dark"] {
  --foreground: #ffffff;
  --background: #0c0e16;
  --accent-primary: #7c5dfa;
  /* ... more CSS variables */
}
```

### 5. **URL-Driven Detail Pages**

Invoice detail & edit pages use dynamic routes:

```typescript
// app/invoices/[id]/page.tsx
export default function InvoiceDetail() {
  const params = useParams();
  const invoiceId = params?.id;
  const { invoices } = useInvoices();
  const invoice = useMemo(
    () => invoices.find(inv => inv.id === invoiceId),
    [invoices, invoiceId]
  );
  // ...
}
```

**Benefits:**
- Shareable URLs: each invoice has a unique, bookmarkable link
- Browser back/forward support: history API integration
- SEO-friendly structure (even for client-side apps)
- Graceful 404: "Invoice not found" message instead of crashes

---

## ⚖️ Trade-offs & Design Decisions

### 1. **localStorage vs. Server Database**

| Aspect | localStorage | Server DB |
|--------|--------------|-----------|
| **Latency** | ~1ms (instant) | 50-200ms (network) |
| **Durability** | Per-device, cleared on cache clear | Multi-device, permanent |
| **Capacity** | ~5-10 MB | Unlimited |
| **Complexity** | Simple key-value | complex schema, migrations |
| **Cost** | Free | $$/month hosting |
| **Use Case** | Single-device, offline-first | Multi-device, shared data |

**Decision**: localStorage chosen because:
- ✅ Eliminates server dependencies (works on read-only filesystems)
- ✅ Instant save feedback (better UX)
- ✅ Runs on serverless/edge platforms
- ❌ Trade-off: Single-device data (no cross-device sync)

**Future: Multi-Device Sync**  
To enable cloud sync, add:
- Backend API (Node.js + PostgreSQL)
- Authentication layer (Auth0/Clerk)
- Conflict resolution (OT/CRDT)
- Progressive sync: localStorage cache + server source-of-truth

### 2. **Client-Side Validation Only**

**Why no server validation?**
- localStorage app has no backend endpoint to validate
- Validation happens immediately in the form
- User sees errors before state changes

**Risk**: Older API routes in `/app/api/invoices/` exist but aren't used.  
**Mitigation**: Validation logic duplicated in TypeScript (`lib/validators.ts`) ensures consistency.

### 3. **No Real-Time Sync Between Tabs**

Currently, opening the app in two tabs won't sync invoice changes:
- Tab A adds invoice → saves to localStorage
- Tab B still shows old list (doesn't refresh)

**Why not cross-tab sync?**
- Adds complexity: storage events + reconciliation
- Most users have app open in one tab
- Can be added with `storage` event listener if needed

**Code to enable it** (future enhancement):

```typescript
useEffect(() => {
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY) {
      setInvoices(JSON.parse(event.newValue || '[]'));
    }
  });
}, []);
```

### 4. **Invoice ID Generation: Client-Side Random**

```typescript
export const generateInvoiceId = (): string => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const randomLetters = Array(2)
    .fill(null)
    .map(() => letters[Math.floor(Math.random() * letters.length)])
    .join('');
  const randomNumbers = Array(4)
    .fill(null)
    .map(() => Math.floor(Math.random() * 10))
    .join('');
  return `${randomLetters}${randomNumbers}`;
};
```

**Trade-off**: Unlike server UUIDs, collisions are theoretically possible (1 in 26²×10⁴ ≈ 1 in 676M).

**Justification**:
- ✅ No server required
- ✅ User-friendly format (shorter than UUIDs)
- ✅ Collision probability negligible for typical usage

**If concerned**: Replace with `crypto.randomUUID()` for cryptographic strength.

### 5. **Dynamic Routing with useParams()**

```typescript
// Pages are 'use client' instead of async SSR
const params = useParams(); // Client-side only
```

**Trade-off**:
- ❌ No server-side rendering (slower initial load time)
- ✅ No hydration mismatch issues
- ✅ Simpler component logic

**Reasoning**: Because data comes from localStorage (not a database), there's no benefit to SSR.

---

## ♿ Accessibility & Compliance

### WCAG 2.1 Level AA Compliance

#### 1. **Semantic HTML**

- ✅ Proper heading hierarchy (`<h1>`, `<h2>`, not just styled divs)
- ✅ Form labels associated with inputs (`htmlFor` attribute)
- ✅ Landmark regions (`<main>`, `<nav>`, `<header>`)
- ✅ Tables with proper `<thead>`, `<tbody>`, captions

```typescript
// ✅ Good: Proper label association
<Input
  label="Client's Email"
  type="email"
  value={email}
  onChange={handleChange}
  error={errors.email}
  required
/>

// ❌ Avoid: Unassociated labels
<label>Email</label>
<input type="email" />
```

#### 2. **Keyboard Navigation**

- ✅ All interactive elements reachable via Tab key
- ✅ Buttons visible with `:focus-visible` outline
- ✅ Modals trap focus (Escape key closes)
- ✅ Form submissions with Enter key

```typescript
// Button component includes focus styling
<Button className="focus:outline-2 focus:outline-[var(--accent-primary)]">
  Save Invoice
</Button>
```

#### 3. **Color Contrast**

- ✅ Text meets WCAG AAA (7:1 minimum ratio)
- ✅ Dark mode color palette reviewed for contrast
- ⚠️ Status badges use color + text label (not color alone)

```typescript
// ✅ Good: Text + color distinguish status
<StatusBadge status="paid" />  // Shows "Paid" label + green background

// ❌ Avoid: Color-only indication
<div className="w-4 h-4 bg-green-500" /> // Colorblind users can't read it
```

#### 4. **Screen Reader Support**

- ✅ `aria-label` on icon-only buttons
- ✅ `aria-expanded` on disclosure widgets
- ✅ `aria-live="polite"` on toast notifications
- ✅ Loading states announced (`aria-busy="true"`)

```typescript
// ✅ Good: Icon button with label
<Button aria-label="Delete invoice">
  <TrashIcon />
</Button>

// Toast notifications are announced
<Toaster position="top-right" />  // react-hot-toast handles aria-live
```

#### 5. **Forms on Mobile**

- ✅ Inputs have proper `type` attributes (email, tel, date, etc.)
- ✅ Mobile users see specialized keyboards
- ✅ Labels remain visible on focus

#### 6. **Error Messages**

- ✅ Errors tied to fields with `aria-describedby`
- ✅ Errors announced immediately
- ✅ Clear, actionable messages

```typescript
<Input
  label="Invoice Date"
  type="date"
  error={errors.createdAt}  // "Date is required"
  aria-describedby={errors.createdAt ? 'error-createdAt' : undefined}
/>
```

### Testing Accessibility

To verify these standards:

```bash
# Install accessibility testing library
npm install --save-dev @testing-library/jest-dom axe-core

# Run in DevTools
# 1. Open browser DevTools → Lighthouse
# 2. Run audit → Accessibility tab
# 3. Look for issues

# Or use automated testing:
npm test -- --testPathPattern=a11y
```

---

## 🚀 Beyond Requirements

### 1. **Dark Mode Toggle**

Built-in theme switching with persistent preference:

- 🌙 Respects system preferences (`prefers-color-scheme`)
- 💾 Saves toggle state to localStorage
- 🎨 Smooth transitions between themes
- ⚡ Zero layout shift on theme change

### 2. **Advanced Filtering**

Multi-status filter on invoice list:

```typescript
// Users can select multiple statuses
<FilterComponent filters={{ draft: true, pending: false, paid: true }} />

// List updates in real-time
const filteredInvoices = filterInvoices(invoices, filters);
```

### 3. **Real-Time Form Validation**

Errors display as user types, with full validation logic:

```typescript
const validation = validateInvoice(formData);
if (!validation.isValid) {
  setErrors(validation.errors);  // Show field-level errors
}
```

### 4. **Responsive Design**

Mobile-first Tailwind approach:
- 📱 Mobile: Optimized touch targets (48px+)
- 📱→💻 Tablet: Flexible layout (2-column grids)
- 💻 Desktop: Full UI with all details visible

### 5. **Empty State UI**

When no invoices exist:
- 🎯 Clear messaging: "Create your first invoice"
- 🔗 CTA button: Direct link to creation form
- 📊 Visual hierarchy preserved

### 6. **Delete Confirmation Modal**

Prevents accidental data loss:

```typescript
<DeleteModal
  isOpen={showDeleteModal}
  onClose={() => setShowDeleteModal(false)}
  onConfirm={handleDelete}
  invoiceId={invoice.id}
/>
```

### 7. **Payment Terms Dropdown**

Quick preset options:
- Net 1 Day
- Net 7 Days
- Net 14 Days
- Net 30 Days

### 8. **Automatic Payment Due Calculation**

Due date computed from invoice date + payment terms:

```typescript
export const calculatePaymentDue = (
  createdAt: string,
  paymentTerms: string
): string => {
  const date = new Date(createdAt);
  date.setDate(date.getDate() + parseInt(paymentTerms, 10));
  return date.toISOString();
};
```

### 9. **Invoice Status Lifecycle**

Three states with visual indicators:
- 📝 **Draft**: Not yet sent (yellow badge)
- ⏳ **Pending**: Awaiting payment (orange badge)
- ✅ **Paid**: Payment received (green badge)

Only pending/sent invoices can be marked paid.

### 10. **Toast Notifications**

Non-intrusive feedback for all actions:
- ✅ Invoice created/updated/deleted
- ❌ Validation errors
- ℹ️ Status change confirmation

---

## 🌐 Browser Support

| Browser | Min Version | Status |
|---------|------------|--------|
| Chrome | 60+ | ✅ Full support |
| Firefox | 55+ | ✅ Full support |
| Safari | 12+ | ✅ Full support |
| Edge (Chromium) | 79+ | ✅ Full support |
| IE 11 | — | ❌ Not supported |

**Required APIs:**
- `localStorage` (ES5)
- CSS Grid / Flexbox
- Fetch API
- Promise/async-await

**To support older browsers**, use polyfills:
```bash
npm install --save core-js
# In next.config.ts:
# transpilePackages: ['core-js']
```

---

## 📚 Additional Resources

- [Next.js 16 Docs](https://nextjs.org/docs)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN: localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

## 📝 License

MIT — Feel free to use this project for personal, educational, or commercial purposes.

---

