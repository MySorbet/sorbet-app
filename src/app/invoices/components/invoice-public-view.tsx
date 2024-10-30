'use client';

import { Download01 } from '@untitled-ui/icons-react';
import Image from 'next/image';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

import { CreateInvoiceFooter } from '@/app/invoices/components/create/create-invoice-footer';
import { InvoiceReceipt } from '@/app/invoices/components/invoice-receipt';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

import { Invoice } from '../components/dashboard/utils';
import {
  CreateInvoiceHeader,
  CreateInvoiceTitle,
} from './create/create-invoice-header';
import { CreateInvoiceShell } from './create/create-invoice-shell';
import { InvoiceDocument } from './invoice-document';
import { InvoicePayUsdc } from './invoice-pay-usdc';

type InvoicePublicViewProps = {
  invoice?: Invoice;
  isLoading?: boolean;
};

export const InvoicePublicView = ({
  invoice,
  isLoading,
}: InvoicePublicViewProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: `sorbet-invoice-${invoice?.invoiceNumber}`,
  });

  // Render closed receipts in the case of paid or cancelled invoices
  if (invoice?.status === 'paid' || invoice?.status === 'cancelled') {
    return (
      <div className='container flex size-full items-center justify-center'>
        <InvoiceReceipt status={invoice.status} />
      </div>
    );
  }

  return (
    <CreateInvoiceShell>
      <CreateInvoiceHeader>
        {isLoading ? (
          <Skeleton variant='lighter' className='h-6 w-40' />
        ) : (
          <div className='flex items-center gap-3'>
            <Image
              src='/svg/logo.svg'
              height={40}
              width={40}
              className='size-10'
              alt='Sorbet logo'
            />
            <CreateInvoiceTitle>
              {invoice?.fromName} sent you an invoice
            </CreateInvoiceTitle>
          </div>
        )}

        <Button variant='outline' onClick={() => reactToPrintFn()}>
          <Download01 className='mr-2 h-4 w-4' /> Download
        </Button>
      </CreateInvoiceHeader>

      {isLoading ? (
        <Skeleton variant='lighter' className='h-[500px] w-[800px]' />
      ) : (
        invoice && <InvoiceDocument invoice={invoice} ref={contentRef} />
      )}

      <CreateInvoiceFooter className='justify-center'>
        {/* TODO: Get the correct address from the invoice */}
        <InvoicePayUsdc address='0x0000000000000000000000000000000000000000' />
      </CreateInvoiceFooter>
    </CreateInvoiceShell>
  );
};
