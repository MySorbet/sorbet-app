import { InvoiceDocument } from '../invoice-document';
import { BackButton } from './back-button';
import { CreateInvoiceFooter } from './create-invoice-footer';
import { CreateInvoiceHeader } from './create-invoice-header';
import { CreateInvoiceShell } from './create-invoice-shell';
import { CreateInvoiceTitle } from './create-invoice-title';
import { ForwardButton } from './forward-button';
import { InvoiceFormData } from './invoice-form-context';

type InvoiceReviewProps = {
  /** Called when the back button is clicked */
  onBack: () => void;
  /** Called when the create button is clicked */
  onCreate: () => void;
  /** The invoice data to render */
  invoice: InvoiceFormData;
  /** Whether the create button is loading (usually during the invoice creation process) */
  isLoading?: boolean;
};

export const InvoiceReview = ({
  onBack,
  onCreate,
  invoice,
  isLoading,
}: InvoiceReviewProps) => {
  return (
    <CreateInvoiceShell>
      <CreateInvoiceHeader>
        <CreateInvoiceTitle>Review</CreateInvoiceTitle>
      </CreateInvoiceHeader>
      <InvoiceDocument invoice={invoice} />
      <CreateInvoiceFooter>
        <BackButton onClick={onBack}>Back to Edit</BackButton>
        <ForwardButton
          onClick={onCreate}
          isLoading={isLoading}
          // TODO: The review button should be disabled if any part of the form state is not valid
          // Not sure if this is even possible
        >
          {isLoading ? 'Creating' : 'Create Invoice'}
        </ForwardButton>
      </CreateInvoiceFooter>
    </CreateInvoiceShell>
  );
};
