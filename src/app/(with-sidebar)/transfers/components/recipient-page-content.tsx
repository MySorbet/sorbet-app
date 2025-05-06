'use client';

import { useState } from 'react';

import { isCryptoFormValues } from '@/app/(with-sidebar)/transfers/components/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { useCreateRecipient } from '../hooks/use-create-recipient';
import { useRecipients } from '../hooks/use-recipients';
import { BankRecipientFormValuesWithRequiredValues } from './bank-recipient-form';
import { CryptoRecipientFormValues } from './crypto-recipient-form';
import { RecipientSheet } from './recipient-sheet';
import { RecipientsCard } from './recipients-card';

export const RecipientPageContent = () => {
  const [open, setOpen] = useState(false);
  const { data: recipients, isLoading: loading } = useRecipients();
  const { mutateAsync: createRecipient } = useCreateRecipient();

  const handleSubmit = async (
    recipient:
      | BankRecipientFormValuesWithRequiredValues
      | CryptoRecipientFormValues
  ) => {
    // TODO: Support EUR here
    const type = isCryptoFormValues(recipient) ? 'crypto' : 'usd';
    const data =
      type === 'crypto'
        ? {
            type: 'crypto' as const,
            values: recipient,
          }
        : {
            type: 'usd' as const,
            values: recipient,
          };
    // TODO: Figure out this type error
    await createRecipient(data);
    setOpen(false);
  };

  return (
    <div className='flex h-fit flex-col gap-4 md:flex-row'>
      <Card className='flex-1'>
        <CardHeader>
          <CardTitle>Send to</CardTitle>
        </CardHeader>
        <CardContent className='size-64'></CardContent>
      </Card>
      <RecipientsCard
        onAdd={() => setOpen(true)}
        recipients={recipients}
        loading={loading}
      />
      <RecipientSheet open={open} setOpen={setOpen} onSubmit={handleSubmit} />
    </div>
  );
};
