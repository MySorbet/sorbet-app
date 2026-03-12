import { zodResolver } from '@hookform/resolvers/zod';
import { omitBy } from 'lodash';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';

import { Form } from '@/components/ui/form';
import { generateInvoicePdfBase64 } from '@/lib/pdf/generate-invoice-pdf';

import {
  defaultInvoiceValues,
  InvoiceForm,
  invoiceFormSchema,
} from '../schema';
import { InvoiceControls } from './invoice-controls/invoice-controls';
import { InvoiceDocument } from './invoice-document';
import { InvoiceDocumentShell } from './invoice-document-shell';
import { CreateInvoiceHeader } from './invoice-header/create-invoice-header';
import { InvoiceWindow } from './invoice-window';

/** Render a WYSIWYG invoice editor with controls for editing the invoice. */
export const CreateInvoice = ({
  prefills,
  onClose,
  onCreate,
  isCreating,
  isBaseEndorsed,
  isEurEndorsed,
  isAedEndorsed,
  isDueVerified,
  onGetVerified,
  onClaimAccount,
  walletAddress,
  stellarWalletAddress,
}: {
  prefills?: Partial<InvoiceForm>;
  onClose?: () => void;
  onCreate?: (invoice: InvoiceForm, pdfBase64?: string) => Promise<void> | void;
  isCreating?: boolean;
  isBaseEndorsed?: boolean;
  isEurEndorsed?: boolean;
  /** Whether the user is endorsed for AED payments. `undefined` means still loading. */
  isAedEndorsed?: boolean;
  /** Whether the user has passed Due KYC. Distinct from per-currency endorsements. */
  isDueVerified?: boolean;
  onGetVerified?: (currency: 'usd' | 'eur' | 'aed') => void;
  /** Callback indicating the user wants to claim an account for a specific currency */
  onClaimAccount?: (currency: 'usd' | 'eur' | 'aed') => void;
  walletAddress?: string;
  /** The user's Stellar wallet address for the USDC Stellar network option. */
  stellarWalletAddress?: string;
}) => {
  // RHF will let undefined values overwrite the default values, so we filter them out
  const filteredPrefills = omitBy(prefills, (value) => value === undefined);

  const invoiceRef = useRef<HTMLDivElement>(null);

  // Form lives at the top level. Controls access this form via context
  const form = useForm<InvoiceForm>({
    resolver: zodResolver(invoiceFormSchema),
    // Provides synchronous prefills and default values
    defaultValues: {
      ...defaultInvoiceValues,
      ...filteredPrefills,
    },
    // Provides asynchronous prefills (spread with default values to satisfy RHF type)
    values: {
      ...defaultInvoiceValues,
      ...filteredPrefills,
    },
    mode: 'all',
  });

  const { isValid } = form.formState;

  // Curry our callback with RHF's handleSubmit
  const onSubmit = form.handleSubmit(async (data) => {
    const transformedData = {
      ...data,
      tax: data.tax === 0 ? undefined : data.tax,
    };

    let pdfBase64: string | undefined;
    if (invoiceRef.current) {
      try {
        pdfBase64 = await generateInvoicePdfBase64(invoiceRef.current);
      } catch {
        // Non-blocking — proceed without attachment if generation fails
      }
    }

    await onCreate?.(transformedData, pdfBase64);
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
        <form onSubmit={onSubmit} className='flex min-h-0 flex-1 gap-6 p-6'>
          <InvoiceWindow>
            <InvoiceDocumentShell>
              <InvoiceDocument invoice={form.watch()} ref={invoiceRef} />
            </InvoiceDocumentShell>
          </InvoiceWindow>
          <InvoiceControls
            isBaseEndorsed={isBaseEndorsed}
            isEurEndorsed={isEurEndorsed}
            isAedEndorsed={isAedEndorsed}
            isDueVerified={isDueVerified}
            onGetVerified={onGetVerified}
            onClaimAccount={onClaimAccount}
            walletAddress={walletAddress}
            stellarWalletAddress={stellarWalletAddress}
          />
        </form>
      </div>
    </Form>
  );
};
