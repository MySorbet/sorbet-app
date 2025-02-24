'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

import { useIsInvoiceSheetOpen } from '@/app/invoices/hooks/use-is-invoice-sheet-open';

import { useCancelInvoice } from '../../hooks/use-cancel-invoice';
import { useInvoicePrinter } from '../../hooks/use-invoice-printer';
import { useOpenInvoice } from '../../hooks/use-open-invoice';
import { usePayInvoice } from '../../hooks/use-pay-invoice';
import { Invoice } from '../../v2/schema';
import InvoiceSheet from './invoice-sheet';
import { InvoiceTable } from './invoice-table';
import SummaryCard from './summary-card';
import { checkOverdue, InvoiceStatus } from './utils';

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
  const {
    isInvoiceSheetOpen,
    setIsInvoiceSheetOpen,
    forceOpenCancelDrawer,
    setForceOpenCancelDrawer,
  } = useIsInvoiceSheetOpen();

  // Manage the open state of the invoice sheet
  // When closing, wait for the animation to complete
  // before clearing the selected invoice
  const handleInvoiceSheetOpen = (open: boolean) => {
    setIsInvoiceSheetOpen(open, undefined, () => {
      setSelectedInvoice(undefined);
    });
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
    setForceOpenCancelDrawer(false);
    // Force the parent to re-fetch invoices
    queryClient.invalidateQueries({
      queryKey: ['invoices'],
    });
  };

  // Cancel the invoice using the mutation hook. When complete, invalidate the invoices query
  // TODO: handle error
  // TODO: Loading states
  // TODO: This could merge with cancel
  const { payInvoiceMutation } = usePayInvoice();
  const { openInvoiceMutation } = useOpenInvoice();
  const handleInvoiceStatusChange = async (
    invoice: Invoice,
    status: InvoiceStatus
  ) => {
    if (status === 'Cancelled') {
      setSelectedInvoice({ ...invoice });
      setIsInvoiceSheetOpen(true, true); // Set the invoice sheet open and force the cancel drawer open
    } else if (status === 'Paid') {
      // Optimistically update the status
      setSelectedInvoice({ ...invoice, status });
      await payInvoiceMutation(invoice.id);
    } else if (status === 'Open') {
      // Optimistically update the status
      setSelectedInvoice({ ...invoice, status });
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

      <div className='@container flex w-full min-w-fit max-w-7xl flex-col gap-10'>
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
