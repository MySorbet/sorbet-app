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
import { useSmartWalletAddress } from '@/hooks/web3/use-smart-wallet-address';
import { useWalletBalance } from '@/hooks/web3/use-wallet-balance';
import { formatCurrency } from '@/lib/currency';

import { BANK_ACCOUNTS_MIN_AMOUNT, needsMigration, usesTransfersApi } from '../utils';

export type TransferResult =
  | { status: 'success'; hash: string }
  | { status: 'fail'; error: string };

type SendToContextType = {
  isPreview: boolean;
  setIsPreview: (value: boolean) => void;
  recipients?: RecipientAPI[];
  selectedRecipientId?: string;
  selectedRecipient?: RecipientAPI;
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

  const { data: walletBalance } = useWalletBalance();
  const maxAmount = walletBalance ? Number(walletBalance) : undefined;

  const { data: allRecipients } = useRecipients();

  // Filter out recipients that need migration to Due Network
  // These recipients must go through the migration flow before they can receive funds
  const recipients = useMemo(() => {
    return allRecipients?.filter((recipient) => !needsMigration(recipient));
  }, [allRecipients]);

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
        purposeCode: z
          .string()
          .optional()
          .refine(
            (value) => {
              const selectedRecipient: RecipientAPI | undefined =
                recipients?.find((r) => r.id === form.getValues().recipient);
              if (!usesTransfersApi(selectedRecipient as RecipientAPI)) return true;
              return !!value;
            },
            { message: 'Please select a purpose for this transfer' }
          ),
      })
    ),
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

  const { sendUSDC: _sendUSDC } = useSendUSDC();
  const { smartWalletAddress } = useSmartWalletAddress();

  const { mutateAsync: sendFundsMutation } = useMutation({
    mutationFn: async ({ amount, purposeCode }: { amount: number; purposeCode?: string }) => {
      if (!selectedRecipient) {
        throw new Error('No recipient selected');
      }

      if (usesTransfersApi(selectedRecipient)) {
        // ACH/WIRE: get a disposable funding address from the backend, then send USDC to it
        console.log(
          `[sendFunds] ACH/WIRE recipient detected (type=${selectedRecipient.type}, id=${selectedRecipient.id}) — using Transfers API`
        );
        if (!smartWalletAddress) {
          throw new Error('Smart wallet not available');
        }
        if (!purposeCode) {
          throw new Error('Purpose code is required for ACH/WIRE transfers');
        }
        console.log(
          `[sendFunds] Calling prepareTransfer — amount=${amount}, senderAddress=${smartWalletAddress}, purposeCode=${purposeCode}`
        );
        const { fundingAddress, sourceAmount, transferId, expiresAt } =
          await recipientsApi.prepareTransfer(
            selectedRecipient.id,
            amount.toString(),
            smartWalletAddress,
            purposeCode
          );
        console.log(
          `[sendFunds] prepareTransfer OK — transferId=${transferId}, fundingAddress=${fundingAddress}, sourceAmount=${sourceAmount}, expiresAt=${expiresAt}`
        );
        const transferTransactionHash = await _sendUSDC(
          sourceAmount,
          fundingAddress
        );
        console.log(
          `[sendFunds] on-chain tx sent — txHash=${transferTransactionHash}`
        );
        return { amount, transferTransactionHash };
      }

      // All other recipients: send directly to the static wallet address
      console.log(
        `[sendFunds] Standard recipient (type=${selectedRecipient.type}) — sending directly to walletAddress`
      );
      const address = selectedRecipient.walletAddress;
      if (!address) {
        throw new Error('Recipient has no wallet address');
      }
      const transferTransactionHash = await _sendUSDC(
        amount.toString(),
        address
      );
      console.log(
        `[sendFunds] on-chain tx sent — txHash=${transferTransactionHash}`
      );
      return { amount, transferTransactionHash };
    },
    onSuccess: ({
      amount,
      transferTransactionHash,
    }: {
      amount: number;
      transferTransactionHash?: `0x${string}`;
    }) => {
      setTransferResult({
        status: 'success',
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
