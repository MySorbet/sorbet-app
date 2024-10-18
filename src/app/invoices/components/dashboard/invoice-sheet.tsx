'use client';

import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Download01 } from '@untitled-ui/icons-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

import { CopyButton } from './copy-button';
import { InvoiceStatusBadge } from './invoice-status-badge';
import { Invoice } from './utils';
import { formatCurrency, formatDate } from './utils';

// TODO: Address scroll when there is not enough height
// TODO: Use custom easing curves to improve the feel of the sheet open animation (match vaul?)

/**
 * Right side sheet that shows the invoice details and actions.
 */
export default function InvoiceSheet({
  open,
  setOpen,
  invoice,
  onEdit,
  onCancel,
  onDownload,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  invoice?: Invoice;
  onEdit?: () => void;
  onCancel?: () => void;
  onDownload?: () => void;
}) {
  if (!invoice) return null;

  const invoiceLink = `${window.location.origin}/invoices/${invoice.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(invoiceLink);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className='flex h-full w-full flex-col justify-between gap-12 p-6'>
        <SheetHeader>
          <SheetTitle className='text-sm font-medium'>
            {invoice.toName}
          </SheetTitle>
          <SheetDescription>
            <VisuallyHidden>Description goes here</VisuallyHidden>
          </SheetDescription>
        </SheetHeader>

        <div className='flex flex-1 flex-col gap-12'>
          {/* Invoice status and total amount */}
          <div>
            <InvoiceStatusBadge variant={invoice.status}>
              {invoice.status}
            </InvoiceStatusBadge>
            <div
              className={cn(
                'mt-3 text-2xl font-semibold',
                invoice.status === 'cancelled' && 'line-through'
              )}
            >
              {formatCurrency(invoice.totalAmount)}
            </div>
          </div>

          <Separator />

          {/* Invoice details */}
          <div className='space-y-4'>
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

          {/* Invoice payment link */}
          <div className='space-y-2'>
            <Label className='text-sm font-medium'>Invoice payment link</Label>
            <Input value={invoiceLink} readOnly className='truncate' />
            <div className='flex gap-2'>
              <Button
                variant='outline'
                size='icon'
                className='min-w-11'
                onClick={onDownload}
              >
                <Download01 className='size-4' />
              </Button>
              <CopyButton
                className='w-full'
                onCopy={handleCopy}
                copyIconClassName='size-4'
                checkIconClassName='size-4'
              >
                Copy Invoice Link
              </CopyButton>
            </div>
          </div>
        </div>

        {/* Invoice actions */}
        <SheetFooter className='items-end'>
          <Button
            variant='outline'
            className='w-full'
            onClick={onCancel}
            disabled={invoice.status === 'cancelled'}
          >
            Cancel Invoice
          </Button>
          <Button
            variant='outline'
            className='w-full'
            onClick={onEdit}
            disabled={invoice.status === 'cancelled'}
          >
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
