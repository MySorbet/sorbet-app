'use client';

import { parseAsBoolean, useQueryState } from 'nuqs';
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
import { SendToDialog } from './send-to-dialog';

export const RecipientPageContent = () => {
  const [addOpen, setAddOpen] = useQueryState(
    'add-recipient',
    parseAsBoolean.withDefault(false)
  );
  const [viewRecipientId, setViewRecipientId] = useQueryState('view-recipient');
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
    (recipient) => recipient.id === viewRecipientId
  );

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
        recipients={recipients}
        loading={loading}
        onClick={setViewRecipientId}
      />
      <AddRecipientSheet
        open={addOpen}
        setOpen={setAddOpen}
        onSubmit={handleSubmit}
      />
      {editRecipient && (
        <RecipientSheet
          open={!!viewRecipientId}
          setOpen={() => setViewRecipientId(null)}
          recipient={editRecipient}
        />
      )}
    </div>
  );
};
