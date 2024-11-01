import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

import { InvoiceStatusBadge } from './invoice-status-badge';
import { formatCurrency, formatDate, Invoice, InvoiceStatus } from './utils';

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
  isLoading,
  onInvoiceStatusChange,
}: {
  invoices: Invoice[];
  onInvoiceClick?: (invoice: Invoice) => void;
  isLoading?: boolean;
  onInvoiceStatusChange?: (invoice: Invoice, status: InvoiceStatus) => void;
}) => {
  return (
    <div className='rounded-2xl bg-white px-6 py-3'>
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
        {isLoading ? (
          <InvoiceTableBodySkeleton />
        ) : invoices.length === 0 ? (
          <EmptyInvoiceTableBody />
        ) : (
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow
                key={invoice.id}
                onClick={() => onInvoiceClick?.(invoice)}
              >
                <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                <TableCell>
                  {/* TODO: Render overdue badge based on date */}
                  <InvoiceStatusBadge
                    variant={invoice.status}
                    interactive
                    onValueChange={(status) =>
                      onInvoiceStatusChange?.(invoice, status)
                    }
                  />
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
        )}
      </Table>
    </div>
  );
};

const EmptyInvoiceTableBody = () => {
  return (
    <TableBody>
      <TableRow>
        <TableCell colSpan={6} className='text-center'>
          🔍 Looks like you don't have any invoices yet
        </TableCell>
      </TableRow>
    </TableBody>
  );
};

/**
 * Skeleton for the invoice table body showing 6 rows of items loading
 */
const InvoiceTableBodySkeleton = () => {
  return (
    <TableBody>
      {[...Array(6)].map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <Skeleton className='h-4 w-20' />
          </TableCell>
          <TableCell>
            <Skeleton className='h-4 w-20' />
          </TableCell>
          <TableCell>
            <Skeleton className='h-4 w-20' />
          </TableCell>
          <TableCell className='text-right'>
            <Skeleton className='h-4 w-20' />
          </TableCell>
          <TableCell>
            <Skeleton className='h-4 w-20' />
          </TableCell>
          <TableCell>
            <Skeleton className='h-4 w-20' />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};
