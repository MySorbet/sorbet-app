import { PDFViewer } from '@react-pdf/renderer';
import { ArrowLeft, ArrowRight } from '@untitled-ui/icons-react';

import { Spinner } from '@/components/common';
import { Button } from '@/components/ui/button';

import { CreateInvoiceFooter } from './create/create-invoice-footer';
import { CreateInvoiceHeader } from './create/create-invoice-header';
import { CreateInvoiceShell } from './create/create-invoice-shell';
import { InvoiceFormData } from './create/invoice-form-context';
import { InvoicePDF } from './invoice-pdf';

type InvoicePDFRenderProps = {
  onBack: () => void;
  onCreate: () => void;
  invoice: InvoiceFormData;
  isLoading?: boolean;
};

export const InvoicePDFRender = ({
  onBack,
  onCreate,
  invoice,
  isLoading,
}: InvoicePDFRenderProps) => {
  return (
    <CreateInvoiceShell>
      <CreateInvoiceHeader>Review</CreateInvoiceHeader>
      <PDFViewer width={800} height={500} showToolbar={false}>
        <InvoicePDF {...invoice} />
      </PDFViewer>
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
