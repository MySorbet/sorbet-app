import { ArrowLeft, ArrowRight } from '@untitled-ui/icons-react';

import { Button } from '@/components/ui/button';

import { CreateInvoiceFooter } from './create-invoice-footer';
import { CreateInvoiceHeader } from './create-invoice-header';

export const PaymentDetails = () => {
  return (
    <div>
      <CreateInvoiceHeader step={3}>Payment Details</CreateInvoiceHeader>
      <CreateInvoiceFooter>
        <Button variant='outline' type='button'>
          <ArrowLeft className='mr-2 h-4 w-4' /> Back
        </Button>
        <Button
          className='bg-sorbet'
          type='submit'
          // disabled={form.formState.isSubmitting || !form.formState.isValid}
        >
          Create Invoice <ArrowRight className='ml-2 h-4 w-4' />
        </Button>
      </CreateInvoiceFooter>
    </div>
  );
};
