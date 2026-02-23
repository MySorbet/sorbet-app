'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

import { DocsButton } from '@/components/common/docs-button';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

import { useIsInvoiceSheetOpen } from '@/app/invoices/hooks/use-is-invoice-sheet-open';

import { useCancelInvoice } from '../../hooks/use-cancel-invoice';
import { useInvoicePrinter } from '../../hooks/use-invoice-printer';
import { useOpenInvoice } from '../../hooks/use-open-invoice';
import { usePayInvoice } from '../../hooks/use-pay-invoice';
import { Invoice } from '../../schema';
import { checkOverdue, InvoiceStatus } from '../../utils';
import { FilteredInvoiceTable } from './filtered-invoice-table';
import InvoiceSheet from './invoice-sheet';
import SummaryCard from './summary-card';

type InvoiceDashboardProps = {
  invoices: Invoice[];
  onCreateNew: () => void;
  isLoading?: boolean;
};

const calculateTotal = (invoices: Invoice[]) => {
  return invoices.reduce((acc, invoice) => acc + invoice.totalAmount, 0);
};

export const InvoiceDashboard = ({
  invoices,
  onCreateNew,
  isLoading,
}: InvoiceDashboardProps) => {
  const openInvoices = invoices.filter((invoice) => invoice.status === 'Open');
  const overdueInvoices = invoices
    .map((invoice) => ({
      ...invoice,
      status: checkOverdue(invoice.dueDate, invoice.status),
    }))
    .filter((invoice) => invoice.status === 'Overdue');
  const paidInvoices = invoices.filter((invoice) => invoice.status === 'Paid');

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice>();
  const {
    isInvoiceSheetOpen,
    setIsInvoiceSheetOpen,
    forceOpenCancelDrawer,
    setForceOpenCancelDrawer,
  } = useIsInvoiceSheetOpen();

  const handleInvoiceSheetOpen = (open: boolean) => {
    setIsInvoiceSheetOpen(open, undefined, () => {
      setSelectedInvoice(undefined);
    });
  };

  const { cancelInvoiceMutation, isPending } = useCancelInvoice();
  const queryClient = useQueryClient();
  const handleCancelInvoice = async () => {
    if (!selectedInvoice) return;
    const cancelledInvoice = await cancelInvoiceMutation(selectedInvoice.id);
    setSelectedInvoice(cancelledInvoice);
    setForceOpenCancelDrawer(false);
    queryClient.invalidateQueries({ queryKey: ['invoices'] });
  };

  const { payInvoiceMutation } = usePayInvoice();
  const { openInvoiceMutation } = useOpenInvoice();
  const handleInvoiceStatusChange = async (invoice: Invoice, status: InvoiceStatus) => {
    if (status === 'Cancelled') {
      setSelectedInvoice({ ...invoice });
      setIsInvoiceSheetOpen(true, true);
    } else if (status === 'Paid') {
      setSelectedInvoice({ ...invoice, status });
      await payInvoiceMutation(invoice.id);
    } else if (status === 'Open') {
      setSelectedInvoice({ ...invoice, status });
      await openInvoiceMutation(invoice.id);
    } else {
      toast.error(`Cannot change invoice status to ${status}`);
      return;
    }

    queryClient.invalidateQueries({ queryKey: ['invoices'] });
  };

  const { HiddenInvoiceDocument, print } = useInvoicePrinter(selectedInvoice);

  return (
    <>
      <HiddenInvoiceDocument />
      <InvoiceSheet
        open={isInvoiceSheetOpen}
        setOpen={handleInvoiceSheetOpen}
        forceConfirmCancel={forceOpenCancelDrawer}
        invoice={selectedInvoice}
        onDownload={print}
        onCancel={handleCancelInvoice}
        isUpdating={isPending}
        onInvoiceStatusChange={(status) => {
          if (!selectedInvoice) return;
          handleInvoiceStatusChange(selectedInvoice, status);
        }}
      />

      <div className='@container size-full w-full max-w-7xl space-y-4 px-[1px] sm:space-y-6 sm:px-0'>
        {/* Header Section */}
        <div className='flex w-full flex-col items-start justify-between gap-4 border-b px-4 pb-4 pt-[1px] sm:flex-row sm:items-center sm:gap-6 sm:px-6 md:min-h-[72px]'>
          {/* Mobile: Title + Buttons in one row */}
          <div className='flex w-full items-center justify-between sm:hidden'>
            <h2 className='text-xl font-semibold'>Invoices</h2>
            <div className='flex shrink-0 gap-2'>
              <DocsButton />
              <Button
                variant='sorbet'
                onClick={onCreateNew}
                size='icon'
                className='size-9'
                aria-label='Create Invoice'
              >
                <Plus className='size-4' />
              </Button>
            </div>
          </div>

          {/* Desktop: Original layout */}
          <div className='hidden min-w-0 flex-1 sm:block'>
            <h2 className='text-2xl font-semibold'>Invoices</h2>
            <p className='text-muted-foreground text-sm'>
              Manage your billing and track payments
            </p>
          </div>

          <div className='hidden shrink-0 gap-3 sm:flex'>
            <DocsButton />
            <Button
              variant='sorbet'
              onClick={onCreateNew}
              className='gap-2'
              size='sm'
            >
              <Plus className='size-4' />
              <span>Create new</span>
            </Button>
          </div>
        </div>

        {/* Summary cards */}
        <div className='@md:flex-row flex flex-col items-center justify-between gap-4 px-4 sm:px-6'>
          <SummaryCard
            label='Total Open'
            value={calculateTotal(openInvoices)}
            invoiceCount={openInvoices.length}
            isLoading={isLoading}
          />
          <SummaryCard
            label='Overdue'
            value={calculateTotal(overdueInvoices)}
            invoiceCount={overdueInvoices.length}
            isLoading={isLoading}
          />
          <SummaryCard
            label='Paid'
            value={calculateTotal(paidInvoices)}
            invoiceCount={paidInvoices.length}
            isLoading={isLoading}
          />
        </div>

        {/* Invoice table */}
        <div className='px-4 sm:px-6'>
          <FilteredInvoiceTable
            invoices={invoices}
            onInvoiceClick={(invoice) => {
              setSelectedInvoice(invoice);
              setIsInvoiceSheetOpen(true);
            }}
            isLoading={isLoading}
            onInvoiceStatusChange={handleInvoiceStatusChange}
            onCreateInvoice={onCreateNew}
          />
        </div>
      </div>
    </>
  );
};
