import { zodResolver } from '@hookform/resolvers/zod';
import { addDays } from 'date-fns';
import { useForm } from 'react-hook-form';

import { Card } from '@/components/ui/card';
import { Form } from '@/components/ui/form';

import { InvoiceControls } from './invoice-controls';
import { InvoiceDocument } from './invoice-document';
import { emptyInvoiceItem, InvoiceForm, invoiceFormSchema } from './schema';

/** Render a WYSIWYG invoice editor with controls for editing the invoice. */
export const CreateInvoice = ({ prefills }: { prefills?: InvoiceForm }) => {
  // Form lives at the top level. Controls access this form via context
  const form = useForm<InvoiceForm>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      issueDate: prefills?.issueDate ?? new Date(), // Prefill today's date
      dueDate: prefills?.dueDate ?? addDays(new Date(), 7),
      memo: prefills?.memo ?? '',
      items: prefills?.items ?? [emptyInvoiceItem],
      invoiceNumber: prefills?.invoiceNumber ?? '',
      tax: prefills?.tax ?? 0,
      fromName: prefills?.fromName ?? '',
      fromEmail: prefills?.fromEmail ?? '',
      toName: prefills?.toName ?? '',
      toEmail: prefills?.toEmail ?? '',
    },
    mode: 'all',
  });

  const handleSubmit = form.handleSubmit((data) => {
    alert(JSON.stringify(data));
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className='flex w-full gap-8 p-6'>
        <Card className='flex flex-1 items-center justify-center'>
          <InvoiceDocument
            invoice={form.getValues()}
            className='m-4 shadow-[0px_20px_110px_0px_#3440540F]'
          />
        </Card>
        <InvoiceControls />
      </form>
    </Form>
  );
};
