'use client';

import { Copy06, Download01, X } from '@untitled-ui/icons-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

import { Invoice } from './invoice-table';
import { InvoiceStatusBadge } from './InvoiceStatusBadge';
import { formatCurrency, formatDate } from './utils';

export default function InvoiceSheet({
  open,
  setOpen,
  invoice,
  onEdit,
  onCancel,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  invoice?: Invoice;
  onEdit?: () => void;
  onCancel?: () => void;
}) {
  if (!invoice) return null;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className='flex h-full w-full flex-col justify-between gap-12 p-3'>
        <SheetHeader>
          <SheetTitle className='text-sm font-medium'>
            {invoice.toName}
          </SheetTitle>
        </SheetHeader>
        <div className='flex flex-1 flex-col gap-12'>
          <div>
            <InvoiceStatusBadge variant={invoice.status}>
              {invoice.status}
            </InvoiceStatusBadge>
            <div className='text-2xl font-semibold'>
              {formatCurrency(invoice.totalAmount)}
            </div>
          </div>
          <Separator />
          <div className='space-y-2'>
            <InvoiceDetail
              label='Due date'
              value={formatDate(invoice.dueDate)}
            />
            <InvoiceDetail
              label='Invoice date'
              value={formatDate(invoice.issueDate)}
            />
            <InvoiceDetail label='Invoice no.' value={invoice.invoiceNumber} />
            <InvoiceDetail label='Project name' value={invoice.projectName} />
          </div>
          <Separator />
          <div className='space-y-2'>
            <h3 className='font-semibold'>Invoice payment link</h3>
            <Input
              value={`mysorbet.io/invoices/${invoice.invoiceNumber}`}
              readOnly
            />

            <div className='flex gap-2'>
              <Button variant='outline' size='icon' className='min-w-11'>
                <Download01 className='size-4' />
              </Button>
              <Button variant='outline' className='w-full'>
                <Copy06 className='mr-2 size-4' />
                Copy invoice link
              </Button>
            </div>
          </div>
        </div>

        <SheetFooter className='flex flex-1 flex-col justify-end'>
          <Button variant='outline' className='w-full' onClick={onCancel}>
            Cancel Invoice
          </Button>
          <Button variant='outline' className='w-full' onClick={onEdit}>
            Edit Invoice
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

/**
 * Local component for displaying rows of invoice details
 */
const InvoiceDetail = ({ label, value }: { label: string; value?: string }) => {
  return (
    <div className='flex justify-between'>
      <span className='text-muted-foreground text-sm font-medium'>{label}</span>
      <span className='text-sm font-semibold'>{value}</span>
    </div>
  );
};
