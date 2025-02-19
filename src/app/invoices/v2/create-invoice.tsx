import { zodResolver } from '@hookform/resolvers/zod';
import { addDays } from 'date-fns';
import { useForm } from 'react-hook-form';

import { Form } from '@/components/ui/form';

import { InvoiceControls } from './invoice-controls';
import { InvoiceDocument } from './invoice-document';
import { emptyInvoiceItemData, InvoiceFormData, schema } from './schema';

export const CreateInvoice = ({ prefills }: { prefills?: InvoiceFormData }) => {
  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      issueDate: prefills?.issueDate ?? new Date(), // Prefill today's date
      dueDate: prefills?.dueDate ?? addDays(new Date(), 7),
      memo: prefills?.memo ?? '',
      items: prefills?.items ?? [emptyInvoiceItemData],
      invoiceNumber: prefills?.invoiceNumber ?? '',
      tax: prefills?.tax ?? 0,
    },
    mode: 'all',
  });

  const handleSubmit = form.handleSubmit((data) => {
    alert(JSON.stringify(data));
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className='flex gap-8'>
        <InvoiceDocument invoice={form.getValues()} />
        <InvoiceControls />
      </form>
    </Form>
  );
};
