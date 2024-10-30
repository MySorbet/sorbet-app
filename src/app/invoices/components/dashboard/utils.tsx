import { InvoiceItemData } from '../create/invoice-details';
import { InvoiceFormData } from '../create/invoice-form-context';

export const InvoiceStatuses = [
  'open',
  'cancelled',
  'overdue',
  'paid',
] as const;
export type InvoiceStatus = (typeof InvoiceStatuses)[number];

export type Invoice = InvoiceFormData & {
  status: InvoiceStatus;
  totalAmount: number;
  id: string;
};

export const calculateTotalAmount = (items: InvoiceItemData[]) => {
  return items.reduce((acc, item) => acc + item.amount * item.quantity, 0);
};

export const formatCurrency = (amount?: number) => {
  if (amount === undefined) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (date?: Date | null) => {
  if (!date) return '';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
