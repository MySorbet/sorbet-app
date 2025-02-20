import { Button } from '@/components/ui/button';

import { InvoiceHeader } from './invoice-header';

/** Header for the create invoice page */
export const CreateInvoiceHeader = ({
  onSaveDraft,
  onCreateInvoice,
  onClose,
  className,
  disabled,
}: {
  onSaveDraft?: () => void;
  onCreateInvoice?: () => void;
  onClose?: () => void;
  className?: string;
  disabled?: boolean;
}) => {
  return (
    <InvoiceHeader onClose={onClose} className={className}>
      <div className='ml-auto [&>*+*]:border-l-0'>
        <Button
          variant='outline'
          className='rounded-none font-semibold first:rounded-l-md last:rounded-r-md'
          onClick={onSaveDraft}
          disabled={disabled}
        >
          Save as draft
        </Button>
        <Button
          variant='sorbet'
          className='rounded-none first:rounded-l-md last:rounded-r-md'
          onClick={onCreateInvoice}
          disabled={disabled}
        >
          Create invoice
        </Button>
      </div>
    </InvoiceHeader>
  );
};
