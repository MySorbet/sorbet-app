'use client';

import { Download01 } from '@untitled-ui/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

import { CreateInvoiceFooter } from '@/app/invoices/components/create/create-invoice-footer';
import { InvoiceReceipt } from '@/app/invoices/components/invoice-receipt';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useSmartWalletAddress } from '@/hooks';

import { Invoice } from '../components/dashboard/utils';
import { CreateInvoiceHeader } from './create/create-invoice-header';
import { CreateInvoiceShell } from './create/create-invoice-shell';
import { CreateInvoiceTitle } from './create/create-invoice-title';
import { CopyButton } from './dashboard/copy-button';
import { InvoiceDocument } from './invoice-document';
import { InvoicePayUsdc } from './invoice-pay-usdc';

type InvoicePublicViewProps = {
  invoice?: Invoice;
  isLoading?: boolean;
  isFreelancer?: boolean;
};

export const InvoicePublicView = ({
  invoice,
  isLoading,
  isFreelancer,
}: InvoicePublicViewProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: `sorbet-invoice-${invoice?.invoiceNumber}`,
  });

  const {
    smartWalletAddress: walletAddress,
    isLoading: isLoadingWalletAddress,
  } = useSmartWalletAddress();

  // Render closed receipts in the case of paid or cancelled invoices
  if (invoice?.status === 'Paid' || invoice?.status === 'Cancelled') {
    return (
      <div className='container flex size-full items-center justify-center'>
        <InvoiceReceipt status={invoice.status} />
      </div>
    );
  }

  const handleCopyInvoiceLink = () => {
    if (invoice) {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const headerText = isFreelancer
    ? 'Invoice details'
    : `${invoice?.fromName} sent you an invoice`;

  return (
    <CreateInvoiceShell>
      <CreateInvoiceHeader>
        {isLoading ? (
          <Skeleton variant='darker' className='h-6 w-40' />
        ) : (
          <div className='flex items-center gap-3'>
            {!isFreelancer && (
              <Image
                src='/svg/logo.svg'
                height={40}
                className='size-10'
                width={40}
                alt='Sorbet logo'
              />
            )}
            <CreateInvoiceTitle>{headerText}</CreateInvoiceTitle>
          </div>
        )}

        <div className='flex items-center gap-2'>
          <Button variant='outline' onClick={() => reactToPrintFn()}>
            <Download01 className='mr-2 h-4 w-4' /> Download
          </Button>
          <CopyButton onCopy={handleCopyInvoiceLink}>
            Copy invoice link
          </CopyButton>
        </div>
      </CreateInvoiceHeader>

      {isLoading ? (
        <Skeleton variant='darker' className='h-[500px] w-[800px]' />
      ) : (
        invoice && <InvoiceDocument invoice={invoice} ref={contentRef} />
      )}

      <CreateInvoiceFooter className='justify-center'>
        {isFreelancer ? (
          <Button variant='sorbet' asChild className='ml-auto'>
            <Link href='/invoices'>Back to dashboard</Link>
          </Button>
        ) : (
          <InvoicePayUsdc
            address={walletAddress ?? ''}
            isLoading={isLoadingWalletAddress}
          />
        )}
      </CreateInvoiceFooter>
    </CreateInvoiceShell>
  );
};
