import { isBefore } from 'date-fns';

import { InvoiceForm, InvoiceItem } from './schema';

export const InvoiceStatuses = [
  'Open',
  'Cancelled',
  'Overdue',
  'Paid',
] as const;
export type InvoiceStatus = (typeof InvoiceStatuses)[number];

/**
 * Descriptions of how long it takes for each payment method to arrive.
 */
export const PAYMENT_TIMING_DESCRIPTIONS = {
  bank: 'Arrives in 0-1 business days',
  crypto: 'Arrives instantly',
} as const;

/**
 * Calculates the total monetary value of a list of invoice items.
 * TODO: Consider doing this server side (or doing it here and then checking the value with the server)
 */
export const calculateTotalAmount = (items: InvoiceItem[]) => {
  return items.reduce((acc, item) => acc + item.amount * item.quantity, 0);
};

/**
 * Calculates the subtotal, tax amount, platform fee, and total amount for an invoice.
 *
 * @param invoice - The invoice to calculate the subtotal, tax amount, and total amount for. Only the `items`, `tax`, and `paymentMethods` properties are required.
 * @param platformFeePercent - Optional platform fee percentage (0-100). If not provided, defaults to 1% for USD/EUR payments.
 * @returns An object containing the subtotal, tax amount, platform fee, and total amount.
 */
export const calculateSubtotalTaxAndTotal = (
  invoice: Pick<InvoiceForm, 'items' | 'tax' | 'paymentMethods'>,
  platformFeePercent?: number
) => {
  const subtotal = calculateTotalAmount(invoice.items ?? []);
  const taxAmount = invoice.tax ? subtotal * (invoice.tax / 100) : 0;
  const subtotalWithTax = subtotal + taxAmount;

  // Calculate platform fee if USD or EUR payment methods are selected
  const includesBankFee = invoice.paymentMethods?.some((method) =>
    ['usd', 'eur'].includes(method)
  );

  // Use provided platform fee percent, or default to 1% if not provided
  const feePercent = platformFeePercent ?? (includesBankFee ? 1 : 0);
  const platformFee = includesBankFee
    ? subtotalWithTax * (feePercent / 100)
    : 0;

  const total = subtotalWithTax + platformFee;
  return {
    subtotal,
    taxAmount,
    developerFee: platformFee,
    total,
    developerFeePercent: feePercent,
  };
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
