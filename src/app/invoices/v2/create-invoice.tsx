import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Card } from '@/components/ui/card';
import { Form } from '@/components/ui/form';

import { InvoiceControls } from './invoice-controls/invoice-controls';
import { InvoiceDocument } from './invoice-document';
import { CreateInvoiceHeader } from './invoice-header/create-invoice-header';
import { defaultInvoiceValues, InvoiceForm, invoiceFormSchema } from './schema';

/** Render a WYSIWYG invoice editor with controls for editing the invoice. */
export const CreateInvoice = ({ prefills }: { prefills?: InvoiceForm }) => {
  // Form lives at the top level. Controls access this form via context
  const form = useForm<InvoiceForm>({
    resolver: zodResolver(invoiceFormSchema),
    values: prefills,
    defaultValues: defaultInvoiceValues,
    mode: 'all',
  });

  const handleSubmit = form.handleSubmit((data) => {
    alert(JSON.stringify(data));
  });

  const handleClose = () => {
    // Router back?
  };

  const handleSaveDraft = () => {
    // Create invoice in draft state
    // Save draft
  };

  const handleCreateInvoice = () => {
    // Create invoice
    // Hook in with form submit?
  };

  return (
    <Form {...form}>
      <div className='flex size-full flex-col'>
        <CreateInvoiceHeader
          onClose={handleClose}
          onSaveDraft={handleSaveDraft}
          onCreateInvoice={handleCreateInvoice}
          // TODO: Disable create invoice if form is invalid
        />
        <form onSubmit={handleSubmit} className='flex w-full flex-1 gap-8 p-6'>
          <Card className='flex flex-1 items-center justify-center'>
            <InvoiceDocument
              invoice={form.getValues()}
              className='m-4 shadow-[0px_20px_110px_0px_#3440540F]'
            />
          </Card>
          <InvoiceControls />
        </form>
      </div>
    </Form>
  );
};
