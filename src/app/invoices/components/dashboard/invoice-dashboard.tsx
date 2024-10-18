import { Plus } from '@untitled-ui/icons-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

import InvoiceSheet from './invoice-sheet';
import { InvoiceTable } from './invoice-table';
import SummaryCard from './summary-card';
import { Invoice } from './utils';

type InvoiceDashboardProps = {
  invoices: Invoice[];
  onCreateNew: () => void;
};

const calculateTotal = (invoices: Invoice[]) => {
  return invoices.reduce((acc, invoice) => acc + invoice.totalAmount, 0);
};

export const InvoiceDashboard = ({
  invoices,
  onCreateNew,
}: InvoiceDashboardProps) => {
  const openInvoices = invoices.filter((invoice) => invoice.status === 'open');
  const overdueInvoices = invoices.filter(
    (invoice) => invoice.status === 'overdue'
  );
  const paidInvoices = invoices.filter((invoice) => invoice.status === 'paid');

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

  return (
    <>
      <InvoiceSheet
        open={open}
        setOpen={handleSetOpen}
        invoice={selectedInvoice}
      />

      <div className='flex w-full max-w-6xl flex-col gap-4'>
        <div className='flex items-center justify-between gap-4'>
          <h1 className='text-2xl font-semibold'>Invoices</h1>
          {/* TODO: Can we make this a button variant? */}
          <Button onClick={onCreateNew} className='bg-sorbet text-white'>
            <Plus className='mr-2 h-4 w-4' />
            Create new
          </Button>
        </div>
        <div className='flex items-center justify-between gap-4'>
          <SummaryCard
            label='Total Open'
            value={calculateTotal(openInvoices)}
            invoiceCount={openInvoices.length}
          />
          <SummaryCard
            label='Overdue'
            value={calculateTotal(overdueInvoices)}
            invoiceCount={overdueInvoices.length}
          />
          <SummaryCard
            label='Paid'
            value={calculateTotal(paidInvoices)}
            invoiceCount={paidInvoices.length}
          />
        </div>
        <InvoiceTable
          invoices={invoices}
          onInvoiceClick={(invoice) => {
            setSelectedInvoice(invoice);
            setOpen(true);
          }}
        />
      </div>
    </>
  );
};
