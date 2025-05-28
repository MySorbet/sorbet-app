'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { useSendUSDC } from '@/app/(with-sidebar)/wallet/hooks/use-send-usdc';
import { useWalletBalance } from '@/hooks/web3/use-wallet-balance';

import { useCreateRecipient } from '../hooks/use-create-recipient';
import { useRecipients } from '../hooks/use-recipients';
import { AddRecipientSheet } from './add-recipient-sheet';
import { BankRecipientFormValuesWithRequiredValues } from './bank-recipient-form';
import { CryptoRecipientFormValues } from './crypto-recipient-form';
import { RecipientSheet } from './recipient-sheet';
import { RecipientsCard } from './recipients-card';
import { SendToCard } from './send-to-card';

export const RecipientPageContent = () => {
  const [addOpen, setAddOpen] = useState(false);
  const [editRecipientId, setEditRecipientId] = useState<string | null>(null);
  const { data: recipients, isLoading: loading } = useRecipients();
  const { mutateAsync: createRecipient } = useCreateRecipient();
  const { sendUSDC } = useSendUSDC();

  const handleSubmit = async (
    recipient:
      | { type: 'usd'; values: BankRecipientFormValuesWithRequiredValues }
      | { type: 'crypto'; values: CryptoRecipientFormValues }
  ) => {
    await createRecipient(recipient);
    setAddOpen(false);
  };

  const handleSend = (amount: number, address: string) => {
    sendUSDC(amount.toString(), address).then(() => {
      toast(`Sent ${amount} USDC to ${address}`);
    });
  };

  const { data: walletBalance } = useWalletBalance();
  const maxAmount = walletBalance ? Number(walletBalance) : undefined;

  const editRecipient = recipients?.find(
    (recipient) => recipient.id === editRecipientId
  );

  return (
    <div className='flex h-fit w-full flex-col items-center justify-center gap-4 md:flex-row md:items-start'>
      <SendToCard
        maxAmount={maxAmount}
        recipients={recipients}
        onAdd={() => setAddOpen(true)}
        onSend={handleSend}
      />
      <RecipientsCard
        onAdd={() => setAddOpen(true)}
        recipients={recipients}
        loading={loading}
        onClick={setEditRecipientId}
      />
      <AddRecipientSheet
        open={addOpen}
        setOpen={setAddOpen}
        onSubmit={handleSubmit}
      />
      {editRecipient && (
        <RecipientSheet
          open={!!editRecipientId}
          setOpen={() => setEditRecipientId(null)}
          recipient={editRecipient}
        />
      )}
    </div>
  );
};
