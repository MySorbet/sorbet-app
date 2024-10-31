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
  userId: string;
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

export const formatDate = (date?: Date | string | null) => {
  // TODO: When a JSON Invoice is serialized and sent to or from a server, the date is representing as a string
  // Then when it is deserialized, it is a string. Ideally, we would handle this where the data is fetched, but this is a quick fix.
  if (typeof date === 'string') {
    console.log('formatting a date given as a string ', date);
    date = new Date(date);
  }

  if (!date) return '';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
