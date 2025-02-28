import { Spinner } from '@/components/common';
import { Button } from '@/components/ui/button';

import { InvoiceHeader } from './invoice-header';

/** Header for the create invoice page */
export const CreateInvoiceHeader = ({
  onSaveDraft,
  onCreateInvoice,
  onClose,
  className,
  disabled,
  isCreating,
}: {
  onSaveDraft?: () => void;
  onCreateInvoice?: () => void;
  onClose?: () => void;
  className?: string;
  disabled?: boolean;
  isCreating?: boolean;
}) => {
  return (
    <InvoiceHeader onClose={onClose} className={className}>
      {/* <div className='ml-auto [&>*+*]:border-l-0'>
        <Button
          variant='outline'
          className='rounded-none font-semibold first:rounded-l-md last:rounded-r-md'
          onClick={onSaveDraft}
          disabled={disabled}
        >
          Save as draft
        </Button> */}
      <Button
        variant='sorbet'
        // className='rounded-none first:rounded-l-md last:rounded-r-md'
        className='ml-auto'
        onClick={onCreateInvoice}
        disabled={disabled || isCreating}
      >
        {isCreating && <Spinner />}
        {isCreating ? 'Creating...' : 'Create invoice'}
      </Button>
      {/* </div> */}
    </InvoiceHeader>
  );
};
