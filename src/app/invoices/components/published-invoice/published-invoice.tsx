import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { toast } from 'sonner';

import { Skeleton } from '@/components/ui/skeleton';
import { sleep } from '@/lib/utils';

import { Invoice } from '../../schema';
import { InvoiceDocument } from '../invoice-document';
import { InvoiceDocumentShell } from '../invoice-document-shell';
import { PublishedInvoiceHeader } from '../invoice-header/published-invoice-header';
import { InvoiceWindow } from '../invoice-window';
import { SentAlert } from './sent-alert';

/** Render a full page displaying a published invoice */
export const PublishedInvoice = ({
  invoice,
  isLoading,
}: {
  invoice?: Invoice;
  isLoading?: boolean;
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: `sorbet-invoice-${invoice?.invoiceNumber}`,
  });

  const router = useRouter();

  // TODO: Fetch this properly
  // For now, set to true since invoices are sent automatically
  const hasSent = true;

  return (
    <div className='flex size-full flex-col'>
      <PublishedInvoiceHeader
        recipientEmail={invoice?.toEmail ?? ''}
        stringToCopy={window.location.href}
        onDownload={reactToPrintFn}
        onSend={sendInvoice}
        onClose={() => {
          router.push('/invoices');
        }}
        disableSend={hasSent}
      />
      <div className='flex min-h-0 flex-1 gap-6 p-6'>
        <InvoiceWindow>
          {hasSent && invoice && (
            <SentAlert
              recipientEmail={invoice?.toEmail ?? ''}
              className='animate-in fade-in slide-in-from-bottom-1 mx-auto mb-6 w-[21cm]'
            />
          )}
          {isLoading ? (
            <Skeleton className='size-[21cm]' />
          ) : (
            invoice && (
              <InvoiceDocumentShell>
                <InvoiceDocument invoice={invoice} ref={contentRef} />
              </InvoiceDocumentShell>
            )
          )}
        </InvoiceWindow>
      </div>
    </div>
  );
};

const sendInvoice = async () => {
  // TODO: API call to send invoice not yet implemented
  await sleep(1000);
  toast('Invoice sending not yet implemented');
};
