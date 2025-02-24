import { Download } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { InvoiceHeader } from './invoice-header';

/** Public invoice header to be rendered for clients visiting the invoice link */
export const PublicInvoiceHeader = ({
  from,
  onDownload,
  onSignUp,
}: {
  from: string;
  onDownload?: () => void;
  onSignUp?: () => void;
}) => {
  return (
    <InvoiceHeader>
      <h1 className='mr-auto text-sm font-medium'>
        {from} sent you an invoice
      </h1>
      <div className='flex items-center gap-2'>
        <Button variant='outline' onClick={onDownload}>
          <Download className='mr-2 size-4' /> Download
        </Button>
        <Button variant='outline' onClick={onSignUp}>
          Sign up
        </Button>
      </div>
    </InvoiceHeader>
  );
};
