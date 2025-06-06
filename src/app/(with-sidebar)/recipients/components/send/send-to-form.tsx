import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { createContext, useContext, useState } from 'react';
import {
  useForm,
  useFormContext,
  useFormState,
  useWatch,
} from 'react-hook-form';
import { z } from 'zod';

import { RecipientAPI } from '@/api/recipients/types';
import { Processing } from '@/app/(with-sidebar)/recipients/components/send/processing';
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
import { formatCurrency } from '@/lib/currency';

import { BANK_ACCOUNTS_MIN_AMOUNT } from '../utils';
import { PreviewSend } from './preview-send';

type SendToContextType = {
  isPreview: boolean;
  setIsPreview: (value: boolean) => void;
  recipients?: RecipientAPI[];
  selectedRecipientId?: string;
  maxAmount?: number;
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

export const SendToFormContext = ({
  children,
  recipients,
  selectedRecipientId,
  maxAmount,
}: {
  children: React.ReactNode;
  recipients?: RecipientAPI[];
  selectedRecipientId?: string;
  maxAmount?: number;
}) => {
  const [isPreview, setIsPreview] = useState(false);
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
    defaultValues: {
      recipient: selectedRecipientId ?? '',
      amount: 0,
    },
    mode: 'onChange',
  });

  return (
    <SendToContext.Provider
      value={{
        isPreview,
        setIsPreview,
        recipients,
        selectedRecipientId,
        maxAmount,
      }}
    >
      <Form {...form}>{children}</Form>
    </SendToContext.Provider>
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
export const SendToForm = ({
  onAdd,
  onSend,
}: {
  onAdd?: () => void;
  onSend?: (amount: number, address: string) => Promise<void>;
}) => {
  const form = useFormContext<FormSchema>();
  const { isPreview, setIsPreview, recipients, maxAmount } = useSendToContext();

  const { isSubmitting, isValid, errors } = useFormState({
    control: form.control,
  });

  const disabled = isSubmitting || !isValid;

  const onSubmit = async (data: FormSchema) => {
    // Prevent form submission when not in preview mode
    if (!isPreview) {
      return;
    }
    const address = recipients?.find(
      (recipient) => recipient.id === data.recipient
    )?.walletAddress;
    if (address) {
      await onSend?.(data.amount, address);
    }
  };

  const { recipient, amount } = useWatch({
    control: form.control,
  });

  if (isSubmitting) {
    return <Processing />;
  }

  return (
    <>
      <form
        onSubmit={(e) => {
          // Prevent the default form submission if not in preview mode
          if (!isPreview) {
            e.preventDefault();
            return;
          }
          form.handleSubmit(onSubmit)(e);
        }}
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
                        className='no-spin-buttons'
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
              {maxAmount && (
                <div className='flex w-full gap-2'>
                  {PERCENTAGES.map((percentage) => (
                    <PercentageButton
                      key={percentage}
                      percentage={percentage}
                      onClick={() =>
                        form.setValue(
                          'amount',
                          maxAmount * (percentage / 100),
                          {
                            shouldValidate: true,
                            shouldDirty: true,
                          }
                        )
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </form>
      {!isPreview && (
        <Button
          className='mt-4 w-full transition-opacity duration-200'
          variant='sorbet'
          type='button'
          disabled={disabled}
          onClick={() => setIsPreview(true)}
        >
          Preview
        </Button>
      )}
    </>
  );
};

export const SendToFormSubmitButton = () => {
  const form = useFormContext<FormSchema>();
  const { isPreview } = useSendToContext();
  const { isSubmitting } = useFormState({
    control: form.control,
  });

  if (!isPreview) {
    return null;
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
  const { isPreview, setIsPreview } = useSendToContext();

  const handleClick = () => {
    isPreview && setIsPreview(false);
    !isPreview && onClose?.();
  };

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

/** What percentages should the user be able to select? */
const PERCENTAGES = [25, 50, 75, 100];

/** Local component to render a button showing a percentage of the max amount and a callback to set that percentage*/
const PercentageButton = ({
  percentage,
  onClick,
}: {
  percentage: number;
  onClick?: (percentage: number) => void;
}) => {
  return (
    <Button
      variant='secondary'
      className='min-w-fit flex-1'
      type='button'
      onClick={() => onClick?.(percentage)}
    >
      {percentage}%
    </Button>
  );
};
