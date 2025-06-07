'use client';

import { useQueryState } from 'nuqs';
import { useState } from 'react';

import { useAddRecipientOpen } from '../hooks/use-add-recipient-open';
import { useCreateRecipient } from '../hooks/use-create-recipient';
import { useDeleteRecipient } from '../hooks/use-delete-recipient';
import { useRecipients } from '../hooks/use-recipients';
import { AddRecipientSheet } from './add-recipient-sheet';
import { BankRecipientFormValuesWithRequiredValues } from './bank-recipient-form';
import { CryptoRecipientFormValues } from './crypto-recipient-form';
import { RecipientSheet } from './recipient-sheet';
import { RecipientsCard } from './recipients-card';
import { SendToDialog } from './send/send-to-dialog';

export const RecipientPageContent = () => {
  const [addOpen, setAddOpen] = useAddRecipientOpen();
  const [viewRecipientId, setViewRecipientId] = useQueryState('view-recipient');
  const { data: recipients, isLoading: loading } = useRecipients();
  const { mutateAsync: createRecipient } = useCreateRecipient();
  const { mutateAsync: deleteRecipient, isPending: isDeleting } =
    useDeleteRecipient();

  const handleSubmit = async (
    recipient:
      | { type: 'usd'; values: BankRecipientFormValuesWithRequiredValues }
      | { type: 'crypto'; values: CryptoRecipientFormValues }
  ) => {
    await createRecipient(recipient);
    setAddOpen(false);
  };

  const editRecipient = recipients?.find(
    (recipient) => recipient.id === viewRecipientId
  );
  const [viewRecipientSheetOpen, setViewRecipientSheetOpen] = useState(false);

  const [, setSendTo] = useQueryState('send-to');
  return (
    <>
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
      <SendToDialog onAdd={() => setAddOpen(true)} />
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
    </>
  );
};
