import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { createContext, useContext, useState } from 'react';
import { useForm, useFormContext, useFormState } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { RecipientAPI } from '@/api/recipients/types';
import { useRecipients } from '@/app/(with-sidebar)/recipients/hooks/use-recipients';
import { useSendUSDC } from '@/app/(with-sidebar)/wallet/hooks/use-send-usdc';
import { Form } from '@/components/ui/form';
import { useWalletBalance } from '@/hooks/web3/use-wallet-balance';
import { formatCurrency } from '@/lib/currency';
import { formatWalletAddress } from '@/lib/utils';

import { BANK_ACCOUNTS_MIN_AMOUNT } from '../utils';

export type TransferResult =
  | { status: 'success'; hash: string }
  | { status: 'fail'; error: string };

type SendToContextType = {
  isPreview: boolean;
  setIsPreview: (value: boolean) => void;
  recipients?: RecipientAPI[];
  selectedRecipientId?: string;
  maxAmount?: number;
  transferResult?: TransferResult;
  clearTransferResult: () => void;
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
export type SendToFormSchema = z.infer<typeof formSchema>;

export const useSendToFormContext = () => useFormContext<SendToFormSchema>();
export const useSendToFormState = () =>
  useFormState<SendToFormSchema>({
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
  const [transferResult, setTransferResult] = useState<
    TransferResult | undefined
  >();

  const { data: walletBalance } = useWalletBalance();
  const maxAmount = walletBalance ? Number(walletBalance) : undefined;

  const { data: recipients } = useRecipients();

  const form = useForm<SendToFormSchema>({
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
      setTransferResult({
        status: 'success',
        hash: transferTransactionHash ?? '',
      });
      toast.success(
        `Sent ${formatCurrency(amount)} USDC to ${formatWalletAddress(address)}`
      );
    },
    onError: (error) => {
      setTransferResult({
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
    setTransferResult(undefined);
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
          transferResult,
          clearTransferResult: () => setTransferResult(undefined),
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
