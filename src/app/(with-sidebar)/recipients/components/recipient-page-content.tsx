'use client';

import { useState } from 'react';

import { useAfter } from '@/hooks/use-after';

import { useAddRecipientOpen } from '../hooks/use-add-recipient-open';
import { useCreateRecipient } from '../hooks/use-create-recipient';
import { useDeleteRecipient } from '../hooks/use-delete-recipient';
import { useRecipients } from '../hooks/use-recipients';
import { useSelectedRecipient } from '../hooks/use-selected-recipient';
import { useSendTo } from '../hooks/use-send-to';
import { AddRecipientSheet } from './add-recipient-sheet';
import { BankRecipientFormValues } from './bank-recipient-form';
import { CryptoRecipientFormValues } from './crypto-recipient-form';
import { RecipientSheet } from './recipient-sheet';
import { RecipientsTable } from './recipients-table';
import { SendToDialog } from './send/send-to-dialog';

/** Puts together recipient list render, edit, add, and send to dialog */
export const RecipientPageContent = () => {
  const { data: recipients, isLoading: loading } = useRecipients();
  const [addSheetOpen, setAddSheetOpen] = useAddRecipientOpen();
  const [viewSheetOpen, setViewSheetOpen] = useState(false);
  const { selectedRecipient, setSelectedRecipientId } =
    useSelectedRecipient(recipients);

  const clearSelectedRecipient = useAfter(
    () => setSelectedRecipientId(null),
    300
  );

  const { set } = useSendTo();

  const { mutateAsync: createRecipient } = useCreateRecipient();
  const { mutateAsync: deleteRecipient, isPending: isDeleting } =
    useDeleteRecipient();

  const handleSubmit = async (
    recipient:
      | { type: 'usd'; values: BankRecipientFormValues }
      | { type: 'crypto'; values: CryptoRecipientFormValues }
  ) => {
    await createRecipient(recipient);
    setAddSheetOpen(false);
  };

  return (
    <>
      <RecipientsTable
        onAdd={() => setAddSheetOpen(true)}
        onDelete={(recipientId) => {
          deleteRecipient(recipientId);
        }}
        recipients={recipients}
        loading={loading}
        onClick={(recipientId) => {
          setSelectedRecipientId(recipientId);
          setViewSheetOpen(true);
        }}
      />
      <SendToDialog onAdd={() => setAddSheetOpen(true)} />
      <AddRecipientSheet
        open={addSheetOpen}
        setOpen={setAddSheetOpen}
        onSubmit={handleSubmit}
      />
      <RecipientSheet
        open={viewSheetOpen}
        setOpen={setViewSheetOpen}
        onSend={() => {
          selectedRecipient && set({ recipientId: selectedRecipient.id });
          setViewSheetOpen(false);
          // Normally, onAnimationEnd would handle this, but it is not being called when the send dialog is opened overtop of the recipient sheet
          clearSelectedRecipient();
        }}
        onAnimationEnd={() => setSelectedRecipientId(null)}
        recipient={selectedRecipient}
        onDelete={async (recipientId) => {
          await deleteRecipient(recipientId);
          setViewSheetOpen(false);
        }}
        isDeleting={isDeleting}
      />
    </>
  );
};
