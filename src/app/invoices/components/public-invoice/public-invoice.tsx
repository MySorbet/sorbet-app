import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

import { buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useWalletAddressByUserId } from '@/hooks/use-wallet-address-by-user-id';
import { cn } from '@/lib/utils';

import { useACHWireDetails } from '../../hooks/use-ach-wire-details';
import { Invoice } from '../../schema';
import { InvoiceDocument } from '../invoice-document';
import { InvoiceDocumentShell } from '../invoice-document-shell';
import { PublicInvoiceHeader } from '../invoice-header/public-invoice-header';
import { ClientPaymentCard } from './client-payment-card';
import { InvoiceReceipt } from './invoice-receipt';

/** Renders an invoice and payment options for a client to pay the invoice */
export const PublicInvoice = ({
  invoice,
  isLoading,
  isError,
}: {
  invoice?: Invoice;
  isLoading?: boolean;
  isError?: boolean;
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: `sorbet-invoice-${invoice?.invoiceNumber}`,
  });

  const { data: walletAddress, isLoading: isLoadingWalletAddress } =
    useWalletAddressByUserId(invoice?.userId ?? '');

  const { data: achWireDetails, isLoading: isLoadingACHWireDetails } =
    useACHWireDetails(invoice?.userId ?? '', {
      enabled: invoice?.paymentMethods?.includes('usdc'),
    });

  // Render the receipt jerryrigged for an error in the case of an error
  if (isError) {
    return (
      <div className='container flex size-full items-center justify-center'>
        <InvoiceReceipt
          status='Error'
          className='animate-in fade-in slide-in-from-bottom-1'
        />
      </div>
    );
  }

  // Render closed receipts in the case of paid or cancelled invoices
  if (invoice?.status === 'Paid' || invoice?.status === 'Cancelled') {
    return (
      <div className='container flex size-full items-center justify-center'>
        <InvoiceReceipt
          status={invoice.status}
          className='animate-in fade-in slide-in-from-bottom-1'
        />
      </div>
    );
  }

  return (
    <div className='flex size-full flex-col'>
      <PublicInvoiceHeader
        from={invoice?.fromName}
        onDownload={reactToPrintFn}
      />
      <div className='flex flex-1 gap-6 p-6'>
        <Card className='flex flex-1 flex-col items-center justify-center gap-6 p-6'>
          {isLoading ? (
            <Skeleton className='size-[21cm]' />
          ) : (
            invoice && (
              <InvoiceDocumentShell>
                <InvoiceDocument invoice={invoice} ref={contentRef} />
              </InvoiceDocumentShell>
            )
          )}
        </Card>
        <div className='flex w-96 flex-col justify-between gap-2'>
          <ClientPaymentCard
            address={walletAddress}
            account={achWireDetails}
            dueDate={invoice?.dueDate}
            isLoading={
              isLoading || isLoadingWalletAddress || isLoadingACHWireDetails
            }
          />
          <FollowButton />
        </div>
      </div>
    </div>
  );
};

/** Local component to render a follow button for the sorbet x profile using the follow web intent*/
const FollowButton = () => {
  return (
    <a
      href='https://x.com/intent/follow?screen_name=mysorbetxyz'
      target='_blank'
      rel='noopener noreferrer'
      className={cn(buttonVariants({ variant: 'ghost' }), 'h-fit self-end')}
    >
      Follow Sorbet
    </a>
  );
};
