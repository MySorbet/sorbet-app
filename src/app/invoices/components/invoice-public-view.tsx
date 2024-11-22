'use client';

import { Download01 } from '@untitled-ui/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

import { CopyButton } from '@/components/common/copy-button/copy-button';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWalletAddressByUserId } from '@/hooks/use-wallet-address-by-user-id';

import { useACHWireDetails } from '../hooks/use-ach-wire-details';
import { CreateInvoiceFooter } from './create/create-invoice-footer';
import { CreateInvoiceHeader } from './create/create-invoice-header';
import { CreateInvoiceShell } from './create/create-invoice-shell';
import { CreateInvoiceTitle } from './create/create-invoice-title';
import { Invoice } from './dashboard/utils';
import { InvoiceDocument } from './invoice-document';
import { InvoicePayAchWire } from './invoice-pay-ach-wire';
import { InvoicePayUsdc } from './invoice-pay-usdc';
import { InvoiceReceipt } from './invoice-receipt';

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

  const { data: walletAddress, isLoading: isLoadingWalletAddress } =
    useWalletAddressByUserId(invoice?.userId ?? '');

  const { data: achWireDetails, isLoading: isLoadingACHWireDetails } =
    useACHWireDetails(invoice?.userId ?? '');

  // Render closed receipts in the case of paid or cancelled invoices
  if (invoice?.status === 'Paid' || invoice?.status === 'Cancelled') {
    return (
      <div className='container flex size-full items-center justify-center'>
        <InvoiceReceipt status={invoice.status} />
      </div>
    );
  }

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
          <CopyButton stringToCopy={window.location.href}>
            Copy invoice link
          </CopyButton>
        </div>
      </CreateInvoiceHeader>

      {isLoading ? (
        <Skeleton variant='darker' className='h-[800px] w-[800px]' />
      ) : (
        invoice && <InvoiceDocument invoice={invoice} ref={contentRef} />
      )}

      <CreateInvoiceFooter className='justify-center'>
        {isFreelancer ? (
          <Button variant='sorbet' asChild className='ml-auto'>
            <Link href='/invoices'>Back to dashboard</Link>
          </Button>
        ) : (
          <Tabs
            defaultValue='usdc'
            className='flex max-w-[31rem] flex-col items-center'
          >
            <TabsList>
              <TabsTrigger value='usdc'>Pay USDC</TabsTrigger>
              <TabsTrigger value='ach'>ACH/Wire</TabsTrigger>
            </TabsList>
            <TabsContent value='usdc'>
              <InvoicePayUsdc
                address={walletAddress ?? ''}
                isLoading={isLoadingWalletAddress}
              />
            </TabsContent>
            <TabsContent value='ach'>
              {achWireDetails && (
                <InvoicePayAchWire
                  routingNumber={achWireDetails.routingNumber}
                  accountNumber={achWireDetails.accountNumber}
                  beneficiary={achWireDetails.beneficiary}
                  bank={achWireDetails.bank}
                />
              )}
            </TabsContent>
          </Tabs>
        )}
      </CreateInvoiceFooter>
    </CreateInvoiceShell>
  );
};
