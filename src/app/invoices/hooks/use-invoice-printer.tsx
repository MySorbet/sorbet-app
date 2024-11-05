import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

import { InvoiceDocument } from '@/app/invoices/components/invoice-document';

import { Invoice } from '../components/dashboard/utils';

/**
 * Use this hook to print an invoice in a place where it's not visible to the user.
 *
 * @example
 *   const { HiddenDocument, print } = useInvoicePrinter(selectedInvoice);
 *   return (
 *     <>
 *       <HiddenInvoiceDocument />
 *       <Button onClick={print}>Download</Button>
 *     </>
 *   );
 */
export const useInvoicePrinter = (invoice?: Invoice) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: invoice
      ? `sorbet-invoice-${invoice.invoiceNumber}`
      : 'sorbet-invoice',
  });

  const HiddenInvoiceDocument = () => (
    <VisuallyHidden.Root>
      {invoice && <InvoiceDocument invoice={invoice} ref={contentRef} />}
    </VisuallyHidden.Root>
  );

  return {
    HiddenInvoiceDocument,
    print: reactToPrintFn,
  };
};
