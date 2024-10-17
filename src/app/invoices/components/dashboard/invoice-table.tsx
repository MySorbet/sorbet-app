import { useState } from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

import { InvoiceFormData } from '../create/invoice-form-context';
import { InvoiceStatusBadge } from './InvoiceStatusBadge';
import { formatCurrency, formatDate } from './utils';
export type Invoice = InvoiceFormData & {
  status: 'open' | 'cancelled' | 'overdue' | 'paid';
  totalAmount: number;
};

// TODO: Look into text-secondary-foreground matching design
const InvoiceTableHead = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <TableHead className={cn(className, 'text-xs font-medium')}>
      {children}
    </TableHead>
  );
};

export const InvoiceTable = ({
  invoices,
  onInvoiceClick,
}: {
  invoices: Invoice[];
  onInvoiceClick?: (invoice: Invoice) => void;
}) => {
  return (
    <div className='rounded-lg bg-white px-6 py-3'>
      <Table>
        <TableHeader>
          <TableRow>
            <InvoiceTableHead>Due Date</InvoiceTableHead>
            <InvoiceTableHead>Status</InvoiceTableHead>
            <InvoiceTableHead>Client</InvoiceTableHead>
            <InvoiceTableHead className='text-right'>Amount</InvoiceTableHead>
            <InvoiceTableHead>Invoice no.</InvoiceTableHead>
            <InvoiceTableHead>Invoice date</InvoiceTableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow
              key={invoice.invoiceNumber}
              onClick={() => onInvoiceClick?.(invoice)}
            >
              <TableCell>{formatDate(invoice.dueDate)}</TableCell>
              <TableCell>
                <InvoiceStatusBadge variant={invoice.status}>
                  {invoice.status}
                </InvoiceStatusBadge>
              </TableCell>
              <TableCell>{invoice.toName}</TableCell>
              <TableCell className='text-right'>
                {formatCurrency(invoice.totalAmount)}
              </TableCell>
              <TableCell>{invoice.invoiceNumber}</TableCell>
              <TableCell>{formatDate(invoice.issueDate)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
