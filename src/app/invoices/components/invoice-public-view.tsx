import { PDFViewer } from '@react-pdf/renderer';

import { Skeleton } from '@/components/ui/skeleton';

import { Invoice } from '../components/dashboard/utils';
import { CreateInvoiceHeader } from './create/create-invoice-header';
import { CreateInvoiceShell } from './create/create-invoice-shell';
import { InvoicePDF } from './invoice-pdf';

type InvoicePublicViewProps = {
  invoice?: Invoice;
  isLoading?: boolean;
};

export const InvoicePublicView = ({
  invoice,
  isLoading,
}: InvoicePublicViewProps) => {
  return (
    <CreateInvoiceShell>
      <CreateInvoiceHeader>
        {isLoading ? (
          <Skeleton variant='lighter' className='h-6 w-40' />
        ) : (
          `${invoice?.fromName} sent you an invoice`
        )}
      </CreateInvoiceHeader>
      {/* TODO: Download and pay buttons */}
      {isLoading ? (
        <Skeleton variant='lighter' className='h-[500px] w-[800px]' />
      ) : (
        <PDFViewer width={800} height={500} showToolbar={false}>
          <InvoicePDF {...invoice} />
        </PDFViewer>
      )}
    </CreateInvoiceShell>
  );
};
