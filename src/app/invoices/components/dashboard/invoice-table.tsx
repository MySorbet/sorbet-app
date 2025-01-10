import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency } from '@/lib/currency';
import { cn } from '@/lib/utils';

import { InvoiceStatusBadge } from './invoice-status-badge';
import { checkOverdue, formatDate, Invoice, InvoiceStatus } from './utils';

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

type InvoiceTableProps = {
  /** The invoices to display */
  invoices: Invoice[];
  /** Called when an invoice is clicked */
  onInvoiceClick?: (invoice: Invoice) => void;
  /** Whether the table is loading */
  isLoading?: boolean;
  /** Called when the status of an invoice is changed (via the status badge) */
  onInvoiceStatusChange?: (invoice: Invoice, status: InvoiceStatus) => void;
  /** Called when the user interacts with the empty state CTA*/
  onCreateInvoice?: () => void;
};

/** Renders a table of invoices */
export const InvoiceTable = ({
  invoices,
  onInvoiceClick,
  isLoading,
  onInvoiceStatusChange,
  onCreateInvoice,
}: InvoiceTableProps) => {
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
          <EmptyInvoiceTableBody onCreateInvoice={onCreateInvoice} />
        ) : (
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow
                key={invoice.id}
                onClick={() => onInvoiceClick?.(invoice)}
              >
                <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                <TableCell>
                  <InvoiceStatusBadge
                    variant={checkOverdue(invoice.dueDate, invoice.status)}
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

/**
 * Local component for the empty state of the invoice table
 * Renders a CTA to create a new invoice
 */
const EmptyInvoiceTableBody = ({
  onCreateInvoice,
}: {
  onCreateInvoice?: () => void;
}) => {
  return (
    <TableBody>
      <TableRow className='hover:bg-background'>
        <TableCell colSpan={6} className='py-16 text-center'>
          <p className='mb-1 text-sm font-medium'>No invoices to display</p>
          <p className='mb-6 text-xs font-normal'>
            Your invoices will appear here after they are created
          </p>
          <Button variant='sorbet' onClick={onCreateInvoice}>
            Create invoice
          </Button>
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
