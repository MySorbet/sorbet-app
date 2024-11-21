import { isBefore } from 'date-fns';

import { InvoiceItemData } from '../create/invoice-details';
import { InvoiceFormData } from '../create/invoice-form-context';

export const InvoiceStatuses = [
  'Open',
  'Cancelled',
  'Overdue',
  'Paid',
] as const;
export type InvoiceStatus = (typeof InvoiceStatuses)[number];

export type Invoice = InvoiceFormData & {
  status: InvoiceStatus;
  totalAmount: number;
  id: string;
  userId: string;
};

// Should match the API response from `/invoices/check-number`
export type CheckInvoiceNumberResponse = {
  isAvailable: boolean;
  recommendation?: string;
};

/**
 * Calculates the total monetary value of a list of invoice items.
 * TODO: Consider doing this server side (or doing it here and then checking the value with the server)
 */
export const calculateTotalAmount = (items: InvoiceItemData[]) => {
  return items.reduce((acc, item) => acc + item.amount * item.quantity, 0);
};

/**
 * Use this to format currency anywhere within invoices
 */
export const formatCurrency = (amount?: number) => {
  if (amount === undefined) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

/**
 * Use this to format dates anywhere within invoices
 */
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

/**
 * Transforms an `InvoiceStatus` to `Overdue` if the `dueDate` is in the past and the `status` is `Open`.
 * Otherwise, it returns the original `status`.
 */
export const checkOverdue = (
  dueDate: Date | null,
  status: InvoiceStatus
): InvoiceStatus => {
  const today = new Date();
  if (dueDate && isBefore(dueDate, today) && status === 'Open') {
    return 'Overdue';
  }
  return status;
};
