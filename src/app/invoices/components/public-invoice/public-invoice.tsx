import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

import { useSEPADetails } from '@/app/invoices/hooks/use-sepa-details';
import { buttonVariants } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useWalletAddressByUserId } from '@/hooks/use-wallet-address-by-user-id';
import { cn } from '@/lib/utils';

import { useACHWireDetails } from '../../hooks/use-ach-wire-details';
import { useDueBankDetailsForRail } from '../../hooks/use-due-bank-details';
import { Invoice } from '../../schema';
import { InvoiceDocument } from '../invoice-document';
import { InvoiceDocumentShell } from '../invoice-document-shell';
import { PublicInvoiceHeader } from '../invoice-header/public-invoice-header';
import { InvoiceWindow } from '../invoice-window';
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

  const userId = invoice?.userId ?? '';
  const paymentMethods = invoice?.paymentMethods ?? [];

  // ── USDC ──────────────────────────────────────────────────────────────────
  const { data: walletAddress, isLoading: isLoadingWalletAddress } =
    useWalletAddressByUserId(userId, {
      enabled: paymentMethods.includes('usdc'),
    });

  //Bank details: Due Network `virtualPaymentRail` carries the exact rail chosen at invoice creation time
  // specific Due schema — nothing more.
  const { data: dueBankDetails, isLoading: isLoadingDue } =
    useDueBankDetailsForRail(userId, invoice?.virtualPaymentRail, {
      enabled: !!invoice && !!invoice.virtualPaymentRail,
    });

  // ── Bank details: Bridge (legacy fallback for invoices without a rail) ────
  // Only used when the invoice has no virtualPaymentRail (pre-Due invoices).
  const isLegacyInvoice = !!invoice && !invoice.virtualPaymentRail;

  const { data: bridgeUsdDetails, isLoading: isLoadingBridgeUsd } =
    useACHWireDetails(userId, {
      enabled: isLegacyInvoice && paymentMethods.includes('usd'),
    });

  const { data: bridgeEurDetails, isLoading: isLoadingBridgeEur } =
    useSEPADetails(userId, {
      enabled: isLegacyInvoice && paymentMethods.includes('eur'),
    });

  // For legacy invoices, wrap Bridge data in the DueBankDetailsForRail shape
  // so ClientPaymentCard can stay generic.
  const legacyBankDetails =
    bridgeUsdDetails
      ? ({
          rail: 'usd_ach',
          data: {
            accountType: 'individual',
            accountNumber: bridgeUsdDetails.accountNumber,
            routingNumber: bridgeUsdDetails.routingNumber,
            routingNumberACH: bridgeUsdDetails.routingNumber,
            bankName: bridgeUsdDetails.bank.name,
            bankAddress: bridgeUsdDetails.bank.address,
            accountName: bridgeUsdDetails.beneficiary.name,
            beneficiaryAddress: undefined,
          },
        } as const)
      : bridgeEurDetails
        ? ({
            rail: 'eur_sepa',
            data: {
              accountType: 'individual',
              IBAN: bridgeEurDetails.iban,
              swiftCode: bridgeEurDetails.bic,
              bankName: bridgeEurDetails.bank.name,
              firstName: bridgeEurDetails.accountHolderName,
            },
          } as const)
        : undefined;

  const bankDetails = dueBankDetails ?? legacyBankDetails;

  const isLoadingBankDetails =
    isLoadingDue || isLoadingBridgeUsd || isLoadingBridgeEur;

  // ── Error 

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
      <div className='flex min-h-0 flex-1 gap-6 p-6'>
        <InvoiceWindow>
          {isLoading ? (
            <Skeleton className='size-[21cm]' />
          ) : (
            invoice && (
              <InvoiceDocumentShell>
                <InvoiceDocument invoice={invoice} ref={contentRef} />
              </InvoiceDocumentShell>
            )
          )}
        </InvoiceWindow>
        <div className='flex w-96 flex-col justify-between gap-2'>
          <ClientPaymentCard
            address={walletAddress}
            bankDetails={bankDetails}
            dueDate={invoice?.dueDate}
            paymentMethods={invoice?.paymentMethods}
            isLoading={
              isLoading || isLoadingWalletAddress || isLoadingBankDetails
            }
          />
          <FollowButton />
        </div>
      </div>
    </div>
  );
};

const FollowButton = () => (
  <a
    href='https://x.com/intent/follow?screen_name=mysorbetxyz'
    target='_blank'
    rel='noopener noreferrer'
    className={cn(buttonVariants({ variant: 'ghost' }), 'h-fit self-end')}
  >
    Follow Sorbet
  </a>
);
