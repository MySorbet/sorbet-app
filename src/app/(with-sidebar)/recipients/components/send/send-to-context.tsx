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

import { recipientsApi } from '@/api/recipients/recipients';
import { RecipientAPI } from '@/api/recipients/types';
import { useRecipients } from '@/app/(with-sidebar)/recipients/hooks/use-recipients';
import { useSendUSDC } from '@/app/(with-sidebar)/wallet/hooks/use-send-usdc';
import { Form } from '@/components/ui/form';
import { useMyChain } from '@/hooks/use-my-chain';
import { useSmartWalletAddress } from '@/hooks/web3/use-smart-wallet-address';
import { useWalletBalances } from '@/hooks/web3/use-wallet-balances';
import { formatCurrency } from '@/lib/currency';

import { BANK_ACCOUNTS_MIN_AMOUNT, isBankRecipient, needsMigration, usesTransfersApi } from '../utils';

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
  sendFunds: (amount: number, purposeCode?: string) => Promise<void>;
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
  purposeCode: z.string().optional(),
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

  const { data: allRecipients } = useRecipients();

  // Filter out recipients that need migration to Due Network
  // These recipients must go through the migration flow before they can receive funds
  const recipients = useMemo(() => {
    return allRecipients?.filter((recipient) => !needsMigration(recipient));
  }, [allRecipients]);

  const resolverSchema = formSchema.superRefine((values, ctx) => {
    const selectedRecipient: RecipientAPI | undefined = recipients?.find(
      (r) => r.id === values.recipient
    );

    const paymentChain: 'base' | 'stellar' =
      selectedRecipient?.type === 'crypto_stellar'
        ? 'stellar'
        : selectedRecipient?.type === 'crypto_base'
        ? 'base'
        : isBankRecipient(selectedRecipient)
        ? 'base' // Due bank recipients always pay through Base
        : currentChain;

    const maxAmount =
      paymentChain === 'stellar'
        ? stellarUsdc
          ? Number(stellarUsdc)
          : undefined
        : baseUsdc
        ? Number(baseUsdc)
        : undefined;

    if (
      typeof maxAmount === 'number' &&
      !Number.isNaN(maxAmount) &&
      (values.amount > maxAmount || maxAmount === 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['amount'],
        message: `You have ${formatCurrency(maxAmount ?? 0)} available`,
      });
    }

    const minValueRequired: number =
      isBankRecipient(selectedRecipient) ||
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

    // Purpose code required for Transfers API recipients (ACH/WIRE)
    if (selectedRecipient && usesTransfersApi(selectedRecipient) && !values.purposeCode) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['purposeCode'],
        message: 'Please select a purpose for this transfer',
      });
    }
  });

  const form = useForm<SendToFormSchema>({
    resolver: zodResolver(resolverSchema),
    values: {
      recipient: selectedRecipientId ?? '',
      amount: 0,
      purposeCode: undefined,
    },
    defaultValues: {
      recipient: selectedRecipientId ?? '',
      amount: 0,
      purposeCode: undefined,
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
      : isBankRecipient(selectedRecipient)
      ? 'base' // Due bank recipients always pay through Base
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
  const { smartWalletAddress } = useSmartWalletAddress();

  const { mutateAsync: sendFundsMutation } = useMutation({
    mutationFn: async ({ amount, purposeCode }: { amount: number; purposeCode?: string }) => {
      if (!selectedRecipient) {
        throw new Error('No recipient selected');
      }

      if (sendDisabledReason) {
        throw new Error(sendDisabledReason);
      }

      if (usesTransfersApi(selectedRecipient)) {
        // ACH/WIRE: get a disposable funding address from the backend, then send USDC to it
        if (!smartWalletAddress) {
          throw new Error('Smart wallet not available');
        }
        if (!purposeCode) {
          throw new Error('Purpose code is required for ACH/WIRE transfers');
        }
        const { fundingAddress, sourceAmount } =
          await recipientsApi.prepareTransfer(
            selectedRecipient.id,
            amount.toString(),
            smartWalletAddress,
            purposeCode
          );
        const transferTransactionHash = await _sendUSDC(
          sourceAmount,
          fundingAddress,
          'base' // ACH/WIRE transfers always go through Base
        );
        return { amount, transferTransactionHash };
      }

      // All other recipients: chain-aware direct send
      const address = selectedRecipient.walletAddress;
      if (!address) {
        throw new Error('Recipient has no wallet address');
      }

      const stellarMemo =
        paymentChain === 'stellar' &&
        (selectedRecipient.type === 'usd' || selectedRecipient.type === 'eur') &&
        typeof selectedRecipient.liquidationAddressMemos?.stellar === 'string' &&
        selectedRecipient.liquidationAddressMemos.stellar.length > 0
          ? selectedRecipient.liquidationAddressMemos.stellar
          : undefined;

      const transferTransactionHash = await _sendUSDC(
        amount.toString(),
        address,
        paymentChain,
        stellarMemo
      );
      return { amount, transferTransactionHash };
    },
    onSuccess: ({
      amount,
      transferTransactionHash,
    }: {
      amount: number;
      transferTransactionHash?: string;
    }) => {
      setTransferResult({
        status: 'success',
        chain: paymentChain,
        hash: transferTransactionHash ?? '',
      });
      const recipientLabel = selectedRecipient?.label ?? 'recipient';
      toast.success(`Sent ${formatCurrency(amount)} to ${recipientLabel}`);
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
          sendFunds: async (amount, purposeCode) => {
            await sendFundsMutation({ amount, purposeCode });
          },
        }}
      >
        {children}
      </SendToContext.Provider>
    </Form>
  );
};
