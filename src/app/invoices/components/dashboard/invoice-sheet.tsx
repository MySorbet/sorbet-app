'use client';

import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Download } from 'lucide-react';
import { useEffect, useState } from 'react';

import { CopyButton } from '@/components/common/copy-button/copy-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { formatCurrency } from '@/lib/currency';
import { cn } from '@/lib/utils';

import { Invoice } from '../../schema';
import { checkOverdue, formatDate, InvoiceStatus } from '../../utils';
import { InvoiceSheetCancelDrawer } from './invoice-sheet-cancel-drawer';
import { InvoiceStatusBadge } from './invoice-status-badge';

// TODO: Is there a better scroll solution? Perhaps with sticky header and footer?
// TODO: Use custom easing curves to improve the feel of the sheet open animation (match vaul?)

type InvoiceSheetProps = {
  /** Whether the sheet is open */
  open: boolean;
  /** Callback to set the open state */
  setOpen: (open: boolean) => void;
  /** The invoice to display. Returns `null` if no invoice is passed in. */
  invoice?: Invoice;
  /** Called when the edit button is clicked */
  onEdit?: () => void;
  /** Called when the cancel button is clicked (after confirmation) */
  onCancel?: () => void;
  /** Called when the download button is clicked */
  onDownload?: () => void;
  /** Whether the invoice is being updated */
  isUpdating?: boolean;
  /** Called when the invoice status is changed (via the status badge) */
  onInvoiceStatusChange?: (status: InvoiceStatus) => void;
  /** Whether to force the cancel confirmation drawer to open */
  forceConfirmCancel?: boolean;
};

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
  isUpdating,
  onInvoiceStatusChange,
  forceConfirmCancel,
}: InvoiceSheetProps) {
  // Manage the open state of the cancel confirmation drawer
  // Effect closes the cancel confirmation drawer if the invoice is cancelled
  const [cancelDrawerOpen, setCancelDrawerOpen] = useState(false);

  useEffect(() => {
    if (invoice?.status === 'Cancelled') {
      setCancelDrawerOpen(false);
    }
  }, [invoice?.status]);

  // If forceConfirmCancel is true, open the cancel confirmation drawer
  useEffect(() => {
    if (forceConfirmCancel) {
      setCancelDrawerOpen(true);
    }
  }, [forceConfirmCancel]);

  if (!invoice) return null;

  const invoiceLink = `${window.location.origin}/invoices/${invoice.id}`;

  // Capture the status change from the status badge and open the cancel drawer if the status is cancelled
  const handleStatusBadgeChange = (status: InvoiceStatus) => {
    if (status === 'Cancelled') {
      setCancelDrawerOpen(true);
    } else {
      onInvoiceStatusChange?.(status);
    }
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(open) => {
        if (!open) setCancelDrawerOpen(false);
        setOpen(open);
      }}
    >
      <SheetContent className='flex h-full w-full flex-col gap-0 p-6'>
        <SheetHeader className='text-left space-y-0 pb-3'>
          <SheetTitle className='text-xl font-bold'>
            {invoice.toName}
          </SheetTitle>
          <VisuallyHidden asChild>
            <SheetDescription>
              {`Invoice details for ${invoice.toName} - ${invoice.invoiceNumber}`}
            </SheetDescription>
          </VisuallyHidden>
        </SheetHeader>

        <ScrollArea className='h-full w-full pr-3'>
          <div className='flex flex-1 flex-col gap-8'>
            {/* Invoice status and total amount */}
            <div className='flex flex-col items-start gap-5'>
              <InvoiceStatusBadge
                variant={checkOverdue(invoice.dueDate, invoice.status)}
                interactive
                onValueChange={handleStatusBadgeChange}
              />
              <div
                className='text-[32px] font-bold relative w-fit tracking-tight'
              >
                {formatCurrency(invoice.totalAmount)}
                {invoice.status === 'Cancelled' && (
                  <div className='absolute left-0 right-0 top-1/2 h-[2.5px] -translate-y-1/2 bg-foreground rounded-full' />
                )}
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
              <InvoiceDetail
                label='Invoice no.'
                value={invoice.invoiceNumber}
              />
              {invoice.projectName && (
                <InvoiceDetail
                  label='Project name'
                  value={invoice.projectName}
                />
              )}
            </div>

            <Separator />

            {/* Invoice payment link */}
            <div className='space-y-2'>
              <Label className='text-sm font-medium'>
                Invoice payment link
              </Label>
              <Input value={invoiceLink} readOnly className='truncate' />
              <div className='flex gap-2'>
                <Button
                  variant='outline'
                  size='icon'
                  className='min-w-11'
                  onClick={onDownload}
                >
                  <Download className='size-4' />
                </Button>
                <CopyButton
                  className='w-full'
                  stringToCopy={invoiceLink}
                  copyIconClassName='size-4'
                  checkIconClassName='size-4'
                >
                  Copy Invoice Link
                </CopyButton>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Invoice actions */}
        {invoice.status !== 'Cancelled' && (
          <SheetFooter className='items-end gap-2 sm:gap-0'>
          <Button
            variant='outline'
            className='w-full'
            onClick={() => setCancelDrawerOpen(true)}
          >
            Cancel Invoice
          </Button>
          <Button
            variant='outline'
            className='w-full'
            onClick={onEdit}
            disabled={true} // TODO: Implement edit invoice
          >
            Edit Invoice
          </Button>
        </SheetFooter>
        )}

        {/* Confirmation drawer for cancelling an invoice */}
        <InvoiceSheetCancelDrawer
          open={cancelDrawerOpen}
          setOpen={setCancelDrawerOpen}
          onCancel={onCancel}
          isLoading={isUpdating}
        />
      </SheetContent>
    </Sheet>
  );
}

/**
 * Local component for displaying rows of invoice details
 */
const InvoiceDetail = ({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) => {
  return (
    <div className='flex justify-between'>
      <span className='text-muted-foreground text-sm font-medium'>{label}</span>
      <span className='text-sm font-semibold'>{value}</span>
    </div>
  );
};
