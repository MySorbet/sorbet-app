import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AlertCircle, Plus } from 'lucide-react';
import { createContext, useContext, useState } from 'react';
import {
  useForm,
  useFormContext,
  useFormState,
  useWatch,
} from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { RecipientAPI } from '@/api/recipients/types';
import { Percentages } from '@/app/(with-sidebar)/recipients/components/send/percentages';
import { Processing } from '@/app/(with-sidebar)/recipients/components/send/processing';
import { useRecipients } from '@/app/(with-sidebar)/recipients/hooks/use-recipients';
import { baseScanUrl } from '@/app/(with-sidebar)/wallet/components/utils';
import { useSendUSDC } from '@/app/(with-sidebar)/wallet/hooks/use-send-usdc';
import { Nt } from '@/components/common/nt';
import { Spinner } from '@/components/common/spinner';
import { Button } from '@/components/ui/button';
import {
  Form,
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
import { useWalletBalance } from '@/hooks/web3/use-wallet-balance';
import { formatCurrency } from '@/lib/currency';
import { formatWalletAddress } from '@/lib/utils';

import { BANK_ACCOUNTS_MIN_AMOUNT } from '../utils';
import { PreviewSend } from './preview-send';

export type TransferStatus =
  | { status: 'success'; hash: string }
  | { status: 'fail'; error: string };

type SendToContextType = {
  isPreview: boolean;
  setIsPreview: (value: boolean) => void;
  recipients?: RecipientAPI[];
  selectedRecipientId?: string;
  maxAmount?: number;
  transferStatus?: TransferStatus;
  clearTransferStatus: () => void;
  reset: () => void;
  sendUSDC: (amount: number, address: string) => Promise<void>;
};

const SendToContext = createContext<SendToContextType | undefined>(undefined);

export const useSendToContext = () => {
  const context = useContext(SendToContext);
  if (!context) {
    throw new Error(
      'useSendToContext must be used within a SendToContextProvider'
    );
  }
  return context;
};

const formSchema = z.object({
  recipient: z.string().min(1, {
    message: '', // Disable self explanatory empty recipient error message
  }),
  amount: z.number(),
});
type FormSchema = z.infer<typeof formSchema>;
export const useSendToFormContext = () => useFormContext<FormSchema>();
export const useSendToFormState = () =>
  useFormState<FormSchema>({
    control: useSendToFormContext().control,
  });
export const SendToFormContext = ({
  children,
  selectedRecipientId,
}: {
  children: React.ReactNode;
  selectedRecipientId?: string;
}) => {
  const [isPreview, setIsPreview] = useState(false);
  const [transferStatus, setTransferStatus] = useState<
    TransferStatus | undefined
  >();

  const { data: walletBalance } = useWalletBalance();
  const maxAmount = walletBalance ? Number(walletBalance) : undefined;

  const { data: recipients } = useRecipients();

  const form = useForm<FormSchema>({
    resolver: zodResolver(
      formSchema.extend({
        amount: z
          .number()
          .gt(0, { message: '' }) // Disable self explanatory 0 error message
          .max(maxAmount ?? Infinity, {
            message: `You have ${formatCurrency(maxAmount ?? 0)} available`,
          })
          // Here we require the amount to be greater than the minimum amount for bank recipients
          .refine(
            (value) => {
              const selectedRecipient: RecipientAPI | undefined =
                recipients?.find((r) => r.id === form.getValues().recipient);
              const minValueRequired: number =
                selectedRecipient?.type === 'usd' ||
                selectedRecipient?.type === 'eur'
                  ? BANK_ACCOUNTS_MIN_AMOUNT
                  : 0;
              return value >= minValueRequired;
            },
            {
              message: `The minimum amount you can send to this recipient is ${formatCurrency(
                BANK_ACCOUNTS_MIN_AMOUNT
              )}`,
            }
          ),
      })
    ),
    values: {
      recipient: selectedRecipientId ?? '',
      amount: 0,
    },
    defaultValues: {
      recipient: selectedRecipientId ?? '',
      amount: 0,
    },
    mode: 'onChange',
  });

  const { sendUSDC: _sendUSDC } = useSendUSDC();
  const { mutateAsync: sendUSDC } = useMutation({
    mutationFn: async ({
      amount,
      address,
    }: {
      amount: number;
      address: string;
    }) => {
      const transferTransactionHash = await _sendUSDC(
        amount.toString(),
        address
      );
      return { amount, address, transferTransactionHash };
    },
    onSuccess: ({
      amount,
      address,
      transferTransactionHash,
    }: {
      amount: number;
      address: string;
      transferTransactionHash?: `0x${string}`;
    }) => {
      setTransferStatus({
        status: 'success',
        hash: transferTransactionHash ?? '',
      });
      toast.success(
        `Sent ${formatCurrency(amount)} USDC to ${formatWalletAddress(address)}`
      );
    },
    onError: (error) => {
      setTransferStatus({
        status: 'fail',
        error: error.message,
      });
      toast.error('Transaction failed', {
        description: error.message,
      });
      console.error(error);
    },
  });

  const reset = () => {
    form.reset();
    setTransferStatus(undefined);
    setIsPreview(false);
  };

  return (
    <Form {...form}>
      <SendToContext.Provider
        value={{
          isPreview,
          setIsPreview,
          recipients,
          selectedRecipientId,
          maxAmount,
          transferStatus,
          clearTransferStatus: () => setTransferStatus(undefined),
          reset,
          sendUSDC: async (amount, address) => {
            await sendUSDC({ amount, address });
          },
        }}
      >
        {children}
      </SendToContext.Provider>
    </Form>
  );
};

const sendToFormId = 'send-to-form';

/**
 * A form to send funds to a recipient, be they bank or crypto.
 *
 * Note: This experience is built with the assumption that privy UI confirmation is disabled
 *
 * TODO: Consider reading endorsement status to disable interacting with USD or EUR accounts if endorsements are disabled -- is that even possible?
 * TODO: Explore decimal precision. For banks, we probably want to truncate. For crypto, we need more decimals allowed. Check bridge docs.
 */
export const SendToForm = ({ onAdd }: { onAdd?: () => void }) => {
  const form = useSendToFormContext();
  const { isPreview, recipients, maxAmount, transferStatus, sendUSDC } =
    useSendToContext();

  const { isSubmitting, errors } = useSendToFormState();

  const { recipient, amount } = useWatch({
    control: form.control,
  });
  const recipientObj = recipients?.find((r) => r.id === recipient);

  const onSubmit = async (data: FormSchema) => {
    if (!isPreview) return;

    const address = recipientObj?.walletAddress;
    if (address) {
      await sendUSDC(data.amount, address);
    }
  };

  if (isSubmitting) {
    return <Processing />;
  }

  if (transferStatus?.status === 'success') {
    return (
      <div className='animate-in fade-in-0 flex flex-col items-center justify-center gap-6'>
        <span className='text-muted-foreground text-sm font-medium leading-none'>
          You sent
        </span>
        <span className='text-xl font-semibold'>{formatCurrency(amount)}</span>
        <span className='text-muted-foreground text-xs leading-none'>
          {recipientObj?.label}
        </span>
      </div>
    );
  }

  if (transferStatus?.status === 'fail') {
    return (
      <div className='animate-in fade-in-0 flex flex-col items-center justify-center gap-6'>
        <AlertCircle className='text-destructive size-10' />
        <span className='text-sm font-medium leading-none'>
          Transaction failed...
        </span>
      </div>
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className='space-y-10'
      id={sendToFormId}
    >
      {isPreview ? (
        <PreviewSend
          amount={amount}
          recipient={recipients?.find((r) => r.id === recipient)}
        />
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
  const { isPreview, setIsPreview, transferStatus } = useSendToContext();
  const { isSubmitting, isValid } = useSendToFormState();
  const disabled = !isValid;

  if (isSubmitting || transferStatus) {
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
  const { isPreview, setIsPreview, transferStatus, clearTransferStatus } =
    useSendToContext();
  const { isSubmitting } = useSendToFormState();

  const handleClick = () => {
    isPreview && setIsPreview(false);
    !isPreview && onClose?.();
  };

  if (isSubmitting) {
    return null;
  }

  if (transferStatus?.status === 'success') {
    return (
      <Button
        className='w-full transition-opacity duration-200'
        variant='secondary'
        type='button'
        asChild
      >
        <Nt href={baseScanUrl(transferStatus.hash)}>View details</Nt>
      </Button>
    );
  }

  if (transferStatus?.status === 'fail') {
    return (
      <Button
        className='w-full transition-opacity duration-200'
        variant='secondary'
        type='button'
        onClick={() => {
          setIsPreview(true);
          clearTransferStatus();
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
