import { ArrowLeft, ArrowRight } from '@untitled-ui/icons-react';

import { Spinner } from '@/components/common';
import { Button } from '@/components/ui/button';

import { InvoiceDocument } from '../invoice-document';
import { CreateInvoiceFooter } from './create-invoice-footer';
import {
  CreateInvoiceHeader,
  CreateInvoiceTitle,
} from './create-invoice-header';
import { CreateInvoiceShell } from './create-invoice-shell';
import { InvoiceFormData } from './invoice-form-context';

type InvoiceReviewProps = {
  onBack: () => void;
  onCreate: () => void;
  invoice: InvoiceFormData;
  isLoading?: boolean;
};

export const InvoiceReview = ({
  onBack,
  onCreate,
  invoice,
  isLoading,
}: InvoiceReviewProps) => {
  return (
    <CreateInvoiceShell>
      <CreateInvoiceHeader>
        <CreateInvoiceTitle>Review</CreateInvoiceTitle>
      </CreateInvoiceHeader>
      <InvoiceDocument invoice={invoice} />
      <CreateInvoiceFooter>
        <Button variant='outline' type='button' onClick={onBack}>
          <ArrowLeft className='mr-2 h-4 w-4' /> Back to Edit
        </Button>
        <Button
          className='bg-sorbet'
          // TODO: The review button should be disabled if the form is not valid
          onClick={onCreate}
          disabled={isLoading}
        >
          {!isLoading && (
            <span className='flex items-center'>
              Create Invoice{' '}
              <ArrowRight className='animate-in fade-in-0 zoom-in-0 ml-2 h-4 w-4' />
            </span>
          )}
          {isLoading && (
            <span className='ml-2 flex items-center'>
              Creating{' '}
              <div className='animate-in fade-in-0 zoom-in-0 ml-2'>
                <Spinner size='small' />
              </div>
            </span>
          )}
        </Button>
      </CreateInvoiceFooter>
    </CreateInvoiceShell>
  );
};
