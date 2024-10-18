import { InvoiceFormData } from '../create/invoice-form-context';

export type InvoiceStatus = 'open' | 'cancelled' | 'overdue' | 'paid';
export type Invoice = InvoiceFormData & {
  status: InvoiceStatus;
  totalAmount: number;
  id: string;
};

export const formatCurrency = (amount?: number) => {
  if (!amount) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (date?: Date) => {
  // TODO: Address this hack. dates should always be stored as dates in the form context
  if (typeof date === 'string') {
    date = new Date(date);
  }
  if (!date) return '';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
