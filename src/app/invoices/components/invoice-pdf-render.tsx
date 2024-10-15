import { PDFViewer } from '@react-pdf/renderer';
import { ArrowLeft, ArrowRight } from '@untitled-ui/icons-react';

import { Button } from '@/components/ui/button';

import { CreateInvoiceFooter } from './create/create-invoice-footer';
import { CreateInvoiceHeader } from './create/create-invoice-header';
import { InvoiceFormData } from './create/invoice-form-context';
import { InvoicePDF } from './invoice-pdf';

type InvoicePDFRenderProps = {
  onBack: () => void;
  onCreate: () => void;
  data: InvoiceFormData;
};

export const InvoicePDFRender = ({
  onBack,
  onCreate,
  data,
}: InvoicePDFRenderProps) => {
  return (
    <div className='flex flex-col gap-4'>
      <CreateInvoiceHeader step={1}>Review</CreateInvoiceHeader>

      <PDFViewer width={800} height={600} showToolbar={false}>
        <InvoicePDF {...data} />
      </PDFViewer>
      <CreateInvoiceFooter>
        <Button variant='outline' type='button' onClick={onBack}>
          <ArrowLeft className='mr-2 h-4 w-4' /> Back to Edit
        </Button>
        <Button
          className='bg-sorbet'
          // TODO: The review button should be disabled if the form is not valid
          onClick={onCreate}
        >
          Create Invoice <ArrowRight className='ml-2 h-4 w-4' />
        </Button>
      </CreateInvoiceFooter>
    </div>
  );
};
