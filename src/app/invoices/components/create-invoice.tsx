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
import { InvoiceDocumentShell } from './invoice-document-shell';
import { CreateInvoiceHeader } from './invoice-header/create-invoice-header';

/** Render a WYSIWYG invoice editor with controls for editing the invoice. */
export const CreateInvoice = ({
  prefills,
  onClose,
  onCreate,
  isCreating,
  onGetVerified,
  walletAddress,
}: {
  prefills?: Partial<InvoiceForm>;
  onClose?: () => void;
  onCreate?: (invoice: InvoiceForm) => void;
  isCreating?: boolean;
  onGetVerified?: () => void;
  walletAddress?: string;
}) => {
  // Form lives at the top level. Controls access this form via context
  const form = useForm<InvoiceForm>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      ...defaultInvoiceValues,
      ...prefills,
    },
    mode: 'all',
  });

  const { isValid } = form.formState;

  // Curry our callback with RHF's handleSubmit
  const onSubmit = form.handleSubmit((data) => {
    onCreate?.(data);
  });

  // Call the submit handler by executing the returned function
  const handleSaveDraft = () => onSubmit();

  // Call the submit handler by executing the returned function
  const handleCreateInvoice = () => onSubmit();

  return (
    <Form {...form}>
      <div className='flex size-full flex-col'>
        <CreateInvoiceHeader
          onClose={onClose}
          onSaveDraft={handleSaveDraft}
          onCreateInvoice={handleCreateInvoice}
          disabled={!isValid}
          isCreating={isCreating}
        />
        <form onSubmit={onSubmit} className='flex w-full flex-1 gap-6 p-6'>
          <Card className='flex flex-1 items-center justify-center'>
            <InvoiceDocumentShell>
              <InvoiceDocument invoice={form.watch()} />
            </InvoiceDocumentShell>
          </Card>
          <InvoiceControls
            onGetVerified={onGetVerified}
            walletAddress={walletAddress}
          />
        </form>
      </div>
    </Form>
  );
};
