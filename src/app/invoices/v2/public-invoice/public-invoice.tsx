import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

import { useACHWireDetails } from '@/app/invoices/hooks/use-ach-wire-details';
import { InvoiceDocument } from '@/app/invoices/v2/invoice-document';
import { buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useWalletAddressByUserId } from '@/hooks/use-wallet-address-by-user-id';
import { cn } from '@/lib/utils';

import { PublicInvoiceHeader } from '../invoice-header/public-invoice-header';
import { Invoice } from '../schema';
import { ClientPaymentCard } from './client-payment-card';

/** Renders an invoice and payment options for a client to pay the invoice */
export const PublicInvoice = ({ invoice }: { invoice?: Invoice }) => {
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: `sorbet-invoice-${invoice?.invoiceNumber}`,
  });

  const { data: walletAddress, isLoading: isLoadingWalletAddress } =
    useWalletAddressByUserId(invoice?.userId ?? '');

  // TODO: Should we display a loading state when seeing if there are ACH wire details?
  const { data: achWireDetails } = useACHWireDetails(invoice?.userId ?? '');

  if (!invoice) {
    return <div>Invoice not found</div>;
  }

  return (
    <div className='flex size-full flex-col'>
      <PublicInvoiceHeader
        from={invoice.fromName}
        onDownload={reactToPrintFn}
        onSignUp={() => {
          router.push('/signup');
        }}
      />
      <div className='flex flex-1 gap-6 px-4 py-6'>
        <Card className='flex flex-1 flex-col items-center justify-center gap-6 p-6'>
          <InvoiceDocument
            ref={contentRef}
            invoice={invoice}
            className='m-4 shadow-[0px_20px_110px_0px_#3440540F]'
          />
        </Card>
        <div className='flex w-96 flex-col justify-between gap-2'>
          <ClientPaymentCard
            address={walletAddress}
            account={achWireDetails}
            dueDate={invoice.dueDate}
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
      href={'https://x.com/intent/follow?screen_name=mysorbetxyz'}
      target='_blank'
      rel='noopener noreferrer'
      className={cn(buttonVariants({ variant: 'ghost' }), 'h-fit self-end')}
    >
      Follow Sorbet
    </a>
  );
};
