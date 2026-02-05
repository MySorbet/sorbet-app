import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { createContext, useContext, useMemo, useState } from 'react';
import {
  useForm,
  useFormContext,
  useFormState,
  useWatch,
} from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { RecipientAPI } from '@/api/recipients/types';
import { useRecipients } from '@/app/(with-sidebar)/recipients/hooks/use-recipients';
import { useSendUSDC } from '@/app/(with-sidebar)/wallet/hooks/use-send-usdc';
import { Form } from '@/components/ui/form';
import { useWalletBalances } from '@/hooks/web3/use-wallet-balances';
import { useMyChain } from '@/hooks/use-my-chain';
import { formatCurrency } from '@/lib/currency';
import { formatWalletAddress } from '@/lib/utils';

import { BANK_ACCOUNTS_MIN_AMOUNT } from '../utils';

export type TransferResult =
  | { status: 'success'; chain: 'base' | 'stellar'; hash: string }
  | { status: 'fail'; error: string };

type SendToContextType = {
  isPreview: boolean;
  setIsPreview: (value: boolean) => void;
  recipients?: RecipientAPI[];
  selectedRecipientId?: string;
  selectedRecipient?: RecipientAPI;
  paymentChain: 'base' | 'stellar';
  sendDisabledReason?: string;
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

  const { data: myChainData } = useMyChain();
  const currentChain = myChainData?.chain ?? 'base';
  const { baseUsdc, stellarUsdc } = useWalletBalances();

  const { data: recipients } = useRecipients();

  const resolverSchema = formSchema.superRefine((values, ctx) => {
    const selectedRecipient: RecipientAPI | undefined = recipients?.find(
      (r) => r.id === values.recipient
    );

    const paymentChain: 'base' | 'stellar' =
      selectedRecipient?.type === 'crypto_stellar'
        ? 'stellar'
        : selectedRecipient?.type === 'crypto_base'
          ? 'base'
          : currentChain;

    const maxAmount =
      paymentChain === 'stellar'
        ? stellarUsdc
          ? Number(stellarUsdc)
          : undefined
        : baseUsdc
          ? Number(baseUsdc)
          : undefined;

    if (typeof maxAmount === 'number' && !Number.isNaN(maxAmount) && (values.amount > maxAmount || maxAmount === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['amount'],
        message: `You have ${formatCurrency(maxAmount ?? 0)} available`,
      });
    }

    const minValueRequired: number =
      selectedRecipient?.type === 'usd' || selectedRecipient?.type === 'eur'
        ? BANK_ACCOUNTS_MIN_AMOUNT
        : 0;
    if (values.amount < minValueRequired) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['amount'],
        message: `The minimum amount you can send to this recipient is ${formatCurrency(
          minValueRequired
        )}`,
      });
    }

    if (
      selectedRecipient &&
      (selectedRecipient.type === 'usd' || selectedRecipient.type === 'eur') &&
      paymentChain === 'stellar' &&
      !selectedRecipient.liquidationAddressIds?.stellar
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['recipient'],
        message: 'This bank recipient is not available on Stellar.',
      });
    }
  });

  const form = useForm<SendToFormSchema>({
    resolver: zodResolver(resolverSchema),
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

  const recipientMap = useMemo(() => {
    return new Map(recipients?.map((r) => [r.id, r]));
  }, [recipients]);
  const id = useWatch({
    control: form.control,
    name: 'recipient',
  });
  const selectedRecipient = recipientMap.get(id);

  const paymentChain: 'base' | 'stellar' =
    selectedRecipient?.type === 'crypto_stellar'
      ? 'stellar'
      : selectedRecipient?.type === 'crypto_base'
        ? 'base'
        : currentChain;

  const maxAmount =
    paymentChain === 'stellar'
      ? stellarUsdc
        ? Number(stellarUsdc)
        : undefined
      : baseUsdc
        ? Number(baseUsdc)
        : undefined;

  const sendDisabledReason =
    selectedRecipient &&
    (selectedRecipient.type === 'usd' || selectedRecipient.type === 'eur') &&
    paymentChain === 'stellar' &&
    !selectedRecipient.liquidationAddressIds?.stellar
      ? 'This bank recipient is not available on Stellar.'
      : undefined;

  const { sendUSDC: _sendUSDC } = useSendUSDC();
  const { mutateAsync: sendUSDC } = useMutation({
    mutationFn: async ({
      amount,
      address,
    }: {
      amount: number;
      address: string;
    }) => {
      if (sendDisabledReason) {
        throw new Error(sendDisabledReason);
      }
      const transferTransactionHash = await _sendUSDC(
        amount.toString(),
        address,
        paymentChain
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
      transferTransactionHash?: string;
    }) => {
      setTransferResult({
        status: 'success',
        chain: paymentChain,
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
          selectedRecipient,
          paymentChain,
          sendDisabledReason,
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
