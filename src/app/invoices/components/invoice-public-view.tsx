import { Download01 } from '@untitled-ui/icons-react';
import Image from 'next/image';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

import { Invoice } from '../components/dashboard/utils';
import {
  CreateInvoiceHeader,
  CreateInvoiceTitle,
} from './create/create-invoice-header';
import { CreateInvoiceShell } from './create/create-invoice-shell';
import { InvoiceDocument } from './invoice-document';

type InvoicePublicViewProps = {
  invoice?: Invoice;
  isLoading?: boolean;
};

export const InvoicePublicView = ({
  invoice,
  isLoading,
}: InvoicePublicViewProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

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
        <div className='flex gap-2'>
          <Button variant='outline' onClick={reactToPrintFn}>
            <Download01 className='mr-2 h-4 w-4' /> Download
          </Button>
          <Button variant='sorbet'>Pay USDC</Button>
        </div>
      </CreateInvoiceHeader>

      {isLoading ? (
        <Skeleton variant='lighter' className='h-[500px] w-[800px]' />
      ) : (
        invoice && (
          <div ref={contentRef}>
            <InvoiceDocument invoice={invoice} />
          </div>
        )
      )}
    </CreateInvoiceShell>
  );
};
