'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { useSendUSDC } from '@/app/(with-sidebar)/wallet/hooks/use-send-usdc';
import { useWalletBalance } from '@/hooks/web3/use-wallet-balance';

import { useCreateRecipient } from '../hooks/use-create-recipient';
import { useRecipients } from '../hooks/use-recipients';
import { BankRecipientFormValuesWithRequiredValues } from './bank-recipient-form';
import { CryptoRecipientFormValues } from './crypto-recipient-form';
import { RecipientSheet } from './recipient-sheet';
import { RecipientsCard } from './recipients-card';
import { SendToCard } from './send-to-card';

export const RecipientPageContent = () => {
  const [open, setOpen] = useState(false);
  const { data: recipients, isLoading: loading } = useRecipients();
  const { mutateAsync: createRecipient } = useCreateRecipient();
  const { sendUSDC } = useSendUSDC();

  const handleSubmit = async (
    recipient:
      | { type: 'usd'; values: BankRecipientFormValuesWithRequiredValues }
      | { type: 'crypto'; values: CryptoRecipientFormValues }
  ) => {
    await createRecipient(recipient);
    setOpen(false);
  };

  const handleSend = (amount: number, address: string) => {
    sendUSDC(amount.toString(), address).then(() => {
      toast(`Sent ${amount} USDC to ${address}`);
    });
  };

  const { data: walletBalance } = useWalletBalance();
  const maxAmount = walletBalance ? Number(walletBalance) : undefined;

  return (
    <div className='flex h-fit w-full flex-col items-center justify-center gap-4 md:flex-row md:items-start'>
      <SendToCard
        maxAmount={maxAmount}
        recipients={recipients}
        onAdd={() => setOpen(true)}
        onSend={handleSend}
      />
      <RecipientsCard
        onAdd={() => setOpen(true)}
        recipients={recipients}
        loading={loading}
      />
      <RecipientSheet open={open} setOpen={setOpen} onSubmit={handleSubmit} />
    </div>
  );
};
