'use client';

import { useQueryClient } from '@tanstack/react-query';
import { Plus } from '@untitled-ui/icons-react';
import { useState } from 'react';

import { useCancelInvoice } from '@/app/invoices/hooks/useCancelInvoice';
import { useInvoicePrinter } from '@/app/invoices/hooks/useInvoicePrinter';
import { usePayInvoice } from '@/app/invoices/hooks/usePayInvoice';
import { Button } from '@/components/ui/button';

import InvoiceSheet from './invoice-sheet';
import { InvoiceTable } from './invoice-table';
import SummaryCard from './summary-card';
import { Invoice, InvoiceStatus } from './utils';

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
  const overdueInvoices = invoices.filter(
    (invoice) => invoice.status === 'Overdue'
  );
  const paidInvoices = invoices.filter((invoice) => invoice.status === 'Paid');

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice>();
  const [open, setOpen] = useState(false);

  const handleSetOpen = (open: boolean) => {
    setOpen(open);
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

  // Cancel the invoice using the mutation hook. When complete, invalidate the
  // invoices query
  // TODO: handle error
  // TODO: Loading states
  const { payInvoiceMutation, isPending: isPayingInvoice } = usePayInvoice();
  const handleInvoiceStatusChange = async (
    invoice: Invoice,
    status: InvoiceStatus
  ) => {
    if (status === 'Cancelled') {
      await cancelInvoiceMutation(invoice.id);
    } else if (status === 'Paid') {
      await payInvoiceMutation(invoice.id);
    } else {
      // Currently, you can only cancel or pay an invoice
      // You cannot mark an invoice as open (reopen) and overdue is cosmetic
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
        open={open}
        setOpen={handleSetOpen}
        invoice={selectedInvoice}
        onDownload={print}
        onCancel={handleCancelInvoice}
        isUpdating={isPending}
      />

      <div className='flex w-full max-w-6xl flex-col gap-10'>
        {/* Header */}
        <div className='flex items-center justify-between gap-4'>
          <h1 className='text-2xl font-semibold'>Invoicing</h1>
          <Button onClick={onCreateNew} variant='sorbet'>
            <Plus className='mr-2 h-4 w-4' />
            Create new
          </Button>
        </div>

        {/* Summary cards */}
        <div className='flex items-center justify-between gap-4'>
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
            setOpen(true);
          }}
          isLoading={isLoading}
          onInvoiceStatusChange={handleInvoiceStatusChange}
        />
      </div>
    </>
  );
};
