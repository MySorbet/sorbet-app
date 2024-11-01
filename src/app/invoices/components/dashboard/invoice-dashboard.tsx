'use client';

import { Plus } from '@untitled-ui/icons-react';
import { useState } from 'react';

import { useInvoicePrinter } from '@/app/invoices/hooks/useInvoicePrinter';
import { Button } from '@/components/ui/button';

import InvoiceSheet from './invoice-sheet';
import { InvoiceTable } from './invoice-table';
import SummaryCard from './summary-card';
import { Invoice } from './utils';

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
        />
      </div>
    </>
  );
};
