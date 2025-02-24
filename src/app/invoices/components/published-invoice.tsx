import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { toast } from 'sonner';

import { PublishedInvoiceHeader } from '@/app/invoices/components/invoice-header/published-invoice-header';
import { SentAlert } from '@/app/invoices/components/sent-alert';
import { Card } from '@/components/ui/card';
import { sleep } from '@/lib/utils';

import { Invoice } from '../schema';
import { InvoiceDocument } from './invoice-document';

const sendInvoice = async () => {
  // API call to send invoice not yet implemented
  await sleep(1000);
  toast('Invoice sending not yet implemented');
};

/** Render a full page displaying a published invoice */
export const PublishedInvoice = ({ invoice }: { invoice?: Invoice }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: `sorbet-invoice-${invoice?.invoiceNumber}`,
  });

  const router = useRouter();

  // TODO: Fetch this properly
  // For now, set to true since invoices are sent automatically
  const hasSent = true;

  if (!invoice) {
    return <div>Invoice not found</div>;
  }

  return (
    <div className='flex size-full flex-col'>
      <PublishedInvoiceHeader
        recipientEmail={invoice.toEmail}
        stringToCopy={window.location.href}
        onDownload={reactToPrintFn}
        onSend={sendInvoice}
        onClose={() => {
          router.back();
        }}
        disableSend={hasSent}
      />
      <Card className='m-6 flex flex-1 flex-col items-center justify-center gap-6 p-6'>
        {hasSent && (
          <SentAlert
            recipientEmail={invoice.toEmail}
            className='w-full max-w-[calc(210mm+2rem)]'
            // TODO How to make this properly match the invoice width?
          />
        )}
        <InvoiceDocument
          ref={contentRef}
          invoice={invoice}
          className='shadow-invoice m-4'
        />
      </Card>
    </div>
  );
};
