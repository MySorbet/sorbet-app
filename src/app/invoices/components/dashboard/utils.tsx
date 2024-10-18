import { InvoiceFormData } from '../create/invoice-form-context';

export type Invoice = InvoiceFormData & {
  status: 'open' | 'cancelled' | 'overdue' | 'paid';
  totalAmount: number;
};

export const formatCurrency = (amount?: number) => {
  if (!amount) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (date?: Date) => {
  if (!date) return '';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
