import { ArrowLeft, ArrowRight } from '@untitled-ui/icons-react';

import { Button } from '@/components/ui/button';

import { CreateInvoiceFooter } from './create-invoice-footer';
import { CreateInvoiceHeader } from './create-invoice-header';
import { CreateInvoiceShell } from './create-invoice-shell';

type PaymentDetailsProps = {
  onBack?: () => void;
};
export const PaymentDetails = ({ onBack }: PaymentDetailsProps) => {
  return (
    <CreateInvoiceShell>
      <CreateInvoiceHeader step={3}>Payment Details</CreateInvoiceHeader>
      <CreateInvoiceFooter>
        <Button variant='outline' type='button' onClick={onBack}>
          <ArrowLeft className='mr-2 h-4 w-4' /> Back
        </Button>
        <Button
          className='bg-sorbet'
          type='submit'
          // disabled={form.formState.isSubmitting || !form.formState.isValid}
        >
          Review <ArrowRight className='ml-2 h-4 w-4' />
        </Button>
      </CreateInvoiceFooter>
    </CreateInvoiceShell>
  );
};
