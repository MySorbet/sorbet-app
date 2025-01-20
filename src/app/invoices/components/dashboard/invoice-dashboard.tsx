'use client';

import { useQueryClient } from '@tanstack/react-query';
import { Plus } from '@untitled-ui/icons-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

import { useCancelInvoice } from '../../hooks/use-cancel-invoice';
import { useInvoicePrinter } from '../../hooks/use-invoice-printer';
import { useOpenInvoice } from '../../hooks/use-open-invoice';
import { usePayInvoice } from '../../hooks/use-pay-invoice';
import InvoiceSheet from './invoice-sheet';
import { InvoiceTable } from './invoice-table';
import SummaryCard from './summary-card';
import { checkOverdue, Invoice, InvoiceStatus } from './utils';

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
  // To find overdue invoices, we need to map with checkOverdue since Overdue is not
  // stored in the db. Rather, we decide to display this status on the frontend based on the date.
  const overdueInvoices = invoices
    .map((invoice) => ({
      ...invoice,
      status: checkOverdue(invoice.dueDate, invoice.status),
    }))
    .filter((invoice) => invoice.status === 'Overdue');
  const paidInvoices = invoices.filter((invoice) => invoice.status === 'Paid');

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice>();
  const [isInvoiceSheetOpen, setIsInvoiceSheetOpen] = useState(false);

  // Manage the open state of the invoice sheet
  // When closing, wait for the animation to complete
  // before clearing the selected invoice
  const handleInvoiceSheetOpen = (open: boolean) => {
    setIsInvoiceSheetOpen(open);
    if (!open) {
      setTimeout(() => {
        setSelectedInvoice(undefined);
      }, 300);
    }
  };

  // Cancel an invoice using the mutation hook. When complete, set the selected
  // invoice to the cancelled invoice and invalidate the invoices query
  // TODO: handle error
  const { cancelInvoiceMutation, isPending } = useCancelInvoice();
  const queryClient = useQueryClient();
  const handleCancelInvoice = async () => {
    if (!selectedInvoice) return;
    const cancelledInvoice = await cancelInvoiceMutation(selectedInvoice.id);
    setSelectedInvoice(cancelledInvoice);
    // Force the parent to re-fetch invoices
    queryClient.invalidateQueries({
      queryKey: ['invoices'],
    });
  };

  // Cancel the invoice using the mutation hook. When complete, invalidate the invoices query
  // TODO: handle error
  // TODO: Loading states
  // TODO: This could merge with cancel
  const { payInvoiceMutation, isPending: isPayingInvoice } = usePayInvoice();
  const { openInvoiceMutation, isPending: isOpeningInvoice } = useOpenInvoice();
  const handleInvoiceStatusChange = async (
    invoice: Invoice,
    status: InvoiceStatus
  ) => {
    if (status === 'Cancelled') {
      await cancelInvoiceMutation(invoice.id);
    } else if (status === 'Paid') {
      await payInvoiceMutation(invoice.id);
    } else if (status === 'Open') {
      await openInvoiceMutation(invoice.id);
    } else {
      toast.error(`Cannot change invoice status to ${status}`);
      return;
    }

    // Force the parent to re-fetch invoices
    queryClient.invalidateQueries({
      queryKey: ['invoices'],
    });
  };

  const { HiddenInvoiceDocument, print } = useInvoicePrinter(selectedInvoice);

  return (
    <>
      {/* Hidden invoice document for download */}
      <HiddenInvoiceDocument />

      {/* Invoice sheet displaying details when there is a selected invoice */}
      <InvoiceSheet
        open={isInvoiceSheetOpen}
        setOpen={handleInvoiceSheetOpen}
        invoice={selectedInvoice}
        onDownload={print}
        onCancel={handleCancelInvoice}
        isUpdating={isPending}
        onInvoiceStatusChange={(status) => {
          if (!selectedInvoice) return;
          // Optimistically update the status
          setSelectedInvoice({ ...selectedInvoice, status });
          handleInvoiceStatusChange(selectedInvoice, status);
        }}
      />

      <div className='@container flex w-full min-w-fit max-w-6xl flex-col gap-10'>
        {/* Header */}
        <div className='flex items-center justify-between gap-4'>
          <h1 className='text-2xl font-semibold'>Invoicing</h1>
          <Button onClick={onCreateNew} variant='sorbet'>
            <Plus className='mr-2 h-4 w-4' />
            Create new
          </Button>
        </div>

        {/* Summary cards */}
        <div className='@md:flex-row flex flex-col items-center justify-between gap-4'>
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
        <InvoiceTable
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
    </>
  );
};
