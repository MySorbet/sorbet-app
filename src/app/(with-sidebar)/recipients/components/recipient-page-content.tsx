'use client';

import { useQueryState } from 'nuqs';
import { useState } from 'react';
import { toast } from 'sonner';

import { useSendUSDC } from '@/app/(with-sidebar)/wallet/hooks/use-send-usdc';
import { useWalletBalance } from '@/hooks/web3/use-wallet-balance';

import { useAddRecipientOpen } from '../hooks/use-add-recipient-open';
import { useCreateRecipient } from '../hooks/use-create-recipient';
import { useDeleteRecipient } from '../hooks/use-delete-recipient';
import { useRecipients } from '../hooks/use-recipients';
import { AddRecipientSheet } from './add-recipient-sheet';
import { BankRecipientFormValuesWithRequiredValues } from './bank-recipient-form';
import { CryptoRecipientFormValues } from './crypto-recipient-form';
import { RecipientSheet } from './recipient-sheet';
import { RecipientsCard } from './recipients-card';
import { SendToDialog } from './send-to-dialog';

export const RecipientPageContent = () => {
  const [addOpen, setAddOpen] = useAddRecipientOpen();
  const [viewRecipientId, setViewRecipientId] = useQueryState('view-recipient');
  const { data: recipients, isLoading: loading } = useRecipients();
  const { mutateAsync: createRecipient } = useCreateRecipient();
  const { mutateAsync: deleteRecipient, isPending: isDeleting } =
    useDeleteRecipient();
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
    (recipient) => recipient.id === viewRecipientId
  );
  const [viewRecipientSheetOpen, setViewRecipientSheetOpen] = useState(false);

  const [sendTo, setSendTo] = useQueryState('send-to');
  const recipientIdToSendTo =
    sendTo === 'true' ? undefined : sendTo ? sendTo : undefined;

  return (
    <div className='flex h-fit w-full flex-col items-center justify-center gap-4 md:flex-row md:items-start'>
      <SendToDialog
        open={!!sendTo}
        setOpen={(open) => setSendTo(open ? 'true' : null)}
        maxAmount={maxAmount}
        recipients={recipients}
        recipientId={recipientIdToSendTo}
        onAdd={() => setAddOpen(true)}
        onSend={handleSend}
      />
      <RecipientsCard
        onAdd={() => setAddOpen(true)}
        onDelete={(recipientId) => {
          deleteRecipient(recipientId);
        }}
        recipients={recipients}
        loading={loading}
        onClick={(recipientId) => {
          setViewRecipientId(recipientId);
          setViewRecipientSheetOpen(true);
        }}
      />
      <AddRecipientSheet
        open={addOpen}
        setOpen={setAddOpen}
        onSubmit={handleSubmit}
      />

      <RecipientSheet
        open={viewRecipientSheetOpen}
        setOpen={(open) => {
          setViewRecipientSheetOpen(open);
        }}
        onSend={() => {
          setSendTo(editRecipient?.id ?? null);
          setViewRecipientSheetOpen(false);
        }}
        onAnimationEnd={() => setViewRecipientId(null)}
        recipient={editRecipient}
        onDelete={async (recipientId) => {
          await deleteRecipient(recipientId);
          setViewRecipientSheetOpen(false);
        }}
        isDeleting={isDeleting}
      />
    </div>
  );
};
