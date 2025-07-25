import { Plus } from 'lucide-react';
import { useWatch } from 'react-hook-form';

import {
  SendToFormSchema,
  useSendToContext,
  useSendToFormContext,
  useSendToFormState,
} from '@/app/(with-sidebar)/recipients/components/send/send-to-context';
import { baseScanUrl } from '@/app/(with-sidebar)/wallet/components/utils';
import { Nt } from '@/components/common/nt';
import { Spinner } from '@/components/common/spinner';
import { TransactionStatusBadge } from '@/components/common/transaction-status-badge';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatCurrency } from '@/lib/currency';

import { Percentages } from './percentages';
import { PreviewSend } from './preview-send';
import { Processing } from './processing';
import { Success } from './success';

/** ID of the send to form. You can use with the the `form` attribute of a button to submit the form. */
const sendToFormId = 'send-to-form';

/**
 * A form to send funds to a recipient, be they bank or crypto.
 *
 * Note: This experience is built with the assumption that privy UI confirmation is disabled
 *
 * TODO: Consider reading endorsement status to disable interacting with USD or EUR accounts if endorsements are disabled -- is that even possible?
 * TODO: Explore decimal precision. For banks, we probably want to truncate. For crypto, we need more decimals allowed. Check bridge docs.
 *
 * Note: Because of some quirks with Radix dialogs and the fact that the send dialog can be opened overtop of other drawers or sheets,
 * we must take the advice mentioned in [this issue](https://github.com/radix-ui/primitives/issues/1088#issuecomment-2720144489) and lock
 * package versions to the following:
 *
 * ```json
 * "@radix-ui/react-dropdown-menu": "2.1.4",
 * "@radix-ui/react-select": "2.1.4",
 * "@radix-ui/react-popover": "1.1.4",
 * "@radix-ui/react-dialog": "1.1.4",
 *
 * "overrides": {
 *   "@radix-ui/react-dismissable-layer": "1.1.4"
 * }
 * ```
 */
export const SendToForm = ({ onAdd }: { onAdd?: () => void }) => {
  const {
    isPreview,
    recipients,
    maxAmount,
    transferResult,
    sendUSDC,
    selectedRecipient,
  } = useSendToContext();

  const form = useSendToFormContext();
  const { amount } = useWatch({
    control: form.control,
  });

  const { isSubmitting, errors } = useSendToFormState();

  const onSubmit = async (data: SendToFormSchema) => {
    if (!isPreview) return;

    const address = selectedRecipient?.walletAddress;
    if (address) {
      await sendUSDC(data.amount, address);
    }
  };

  if (isSubmitting) {
    return <Processing />;
  }

  if (transferResult?.status === 'success') {
    if (!amount || !selectedRecipient) return null;
    return <Success amount={amount} recipient={selectedRecipient} />;
  }

  if (transferResult?.status === 'fail') {
    return (
      <div className='animate-in fade-in-0 flex flex-col items-center justify-center gap-6'>
        <TransactionStatusBadge status='error' />
        <span className='text-sm font-medium leading-none'>
          There was a problem with the transfer. Please try again.
        </span>
      </div>
    );
  }

  const showPreview = amount && selectedRecipient && isPreview;

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className='space-y-10'
      id={sendToFormId}
    >
      {showPreview ? (
        <PreviewSend amount={amount} recipient={selectedRecipient} />
      ) : (
        <>
          {/* Recipient select */}
          <FormField
            control={form.control}
            name='recipient'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recipient</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      if (value === 'add-new') {
                        field.onChange('', {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                        form.trigger();
                        onAdd?.();
                      } else {
                        field.onChange(value, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                        form.trigger();
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select a recipient' />
                    </SelectTrigger>
                    <SelectContent>
                      {recipients?.map((recipient) => (
                        <SelectItem key={recipient.id} value={recipient.id}>
                          {recipient.label}
                        </SelectItem>
                      ))}
                      <SelectItem value='add-new' className='pl-1'>
                        <div className='flex items-center gap-2 font-semibold'>
                          <Plus className='size-5' />
                          Add new recipient
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='space-y-3'>
            {/* Amount input */}
            <FormField
              control={form.control}
              name='amount'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={String(field.value)}
                      onChange={(e) =>
                        form.setValue('amount', Number(e.target.value), {
                          shouldValidate: true,
                          shouldDirty: true,
                        })
                      }
                      type='number'
                      className='no-spin-buttons text-md'
                    />
                  </FormControl>
                  {maxAmount && !errors.amount && (
                    <p className='text-muted-foreground text-sm'>
                      {formatCurrency(maxAmount)} available
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Percentage buttons */}
            {maxAmount !== undefined && (
              <Percentages
                disabled={maxAmount === undefined}
                onClick={(percentage) =>
                  form.setValue('amount', maxAmount * (percentage / 100), {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
              />
            )}
          </div>
        </>
      )}
    </form>
  );
};

export const SendToFormSubmitButton = () => {
  const { isPreview, setIsPreview, transferResult } = useSendToContext();
  const { isSubmitting, isValid } = useSendToFormState();
  const disabled = !isValid;

  if (isSubmitting || transferResult) {
    return null;
  }

  if (!isPreview) {
    return (
      <Button
        className='w-full transition-opacity duration-200'
        variant='sorbet'
        type='button'
        disabled={disabled}
        onClick={(e) => {
          e.preventDefault();
          setIsPreview(true);
        }}
      >
        Preview
      </Button>
    );
  }

  return (
    <Button
      className='w-full transition-opacity duration-200'
      variant='sorbet'
      form={sendToFormId}
      type='submit'
    >
      {isSubmitting && <Spinner />}
      {isSubmitting ? 'Sending...' : 'Send'}
    </Button>
  );
};

/**
 * Back button for the send form.
 * If pressed in preview mode, exits preview.
 * If called on first step, calls callback
 */
export const SendToFormBackButton = ({ onClose }: { onClose?: () => void }) => {
  const { isPreview, setIsPreview, transferResult, clearTransferResult } =
    useSendToContext();
  const { isSubmitting } = useSendToFormState();

  const handleClick = () => {
    isPreview && setIsPreview(false);
    !isPreview && onClose?.();
  };

  if (isSubmitting) {
    return null;
  }

  if (transferResult?.status === 'success') {
    return (
      <Button
        className='w-full transition-opacity duration-200'
        variant='secondary'
        type='button'
        asChild
      >
        <Nt href={baseScanUrl(transferResult.hash)}>View details</Nt>
      </Button>
    );
  }

  if (transferResult?.status === 'fail') {
    return (
      <Button
        className='w-full transition-opacity duration-200'
        variant='secondary'
        type='button'
        onClick={() => {
          setIsPreview(true);
          clearTransferResult();
        }}
      >
        Try again
      </Button>
    );
  }

  return (
    <Button
      className='w-full transition-opacity duration-200'
      variant='secondary'
      type='button'
      onClick={handleClick}
    >
      Back
    </Button>
  );
};
