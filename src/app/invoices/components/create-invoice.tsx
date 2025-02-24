import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Card } from '@/components/ui/card';
import { Form } from '@/components/ui/form';

import {
  defaultInvoiceValues,
  InvoiceForm,
  invoiceFormSchema,
} from '../schema';
import { InvoiceControls } from './invoice-controls/invoice-controls';
import { InvoiceDocument } from './invoice-document';
import { CreateInvoiceHeader } from './invoice-header/create-invoice-header';

/** Render a WYSIWYG invoice editor with controls for editing the invoice. */
export const CreateInvoice = ({
  prefills,
  onClose,
  onCreate,
}: {
  prefills?: InvoiceForm;
  onClose?: () => void;
  onCreate?: (invoice: InvoiceForm) => void;
}) => {
  // Form lives at the top level. Controls access this form via context
  const form = useForm<InvoiceForm>({
    resolver: zodResolver(invoiceFormSchema),
    values: prefills,
    defaultValues: defaultInvoiceValues,
    mode: 'all',
  });

  // Curry our callback with RHF's handleSubmit
  const handleSubmit = form.handleSubmit((data) => onCreate?.(data));

  // For now, just call the submit handler
  const handleSaveDraft = () => handleSubmit();

  // For now, just call the submit handler
  const handleCreateInvoice = () => handleSubmit();

  return (
    <Form {...form}>
      <div className='flex size-full flex-col'>
        <CreateInvoiceHeader
          onClose={onClose}
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
