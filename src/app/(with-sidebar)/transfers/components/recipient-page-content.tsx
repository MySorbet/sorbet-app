import { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { BankFormValues } from './bank-form';
import { RecipientSheet } from './recipient-sheet';
import { RecipientsCard } from './recipients-card';
import { mockRecipients, Recipient } from './utils';

export const RecipientPageContent = () => {
  const [open, setOpen] = useState(false);
  const [recipients, setRecipients] = useState<Recipient[]>(mockRecipients);

  const handleSubmit = (recipient: BankFormValues) => {
    // TODO: POST api/recipients
    const display = {
      id: recipients.length.toString(),
      name: recipient.account_owner_name,
      type: recipient.currency,
      detail: recipient.account.account_number,
    };
    setRecipients([...recipients, display]);
    setOpen(false);
  };

  return (
    <div className='flex flex-col gap-4 md:flex-row'>
      <Card className='flex-1'>
        <CardHeader>
          <CardTitle>Send to</CardTitle>
        </CardHeader>
        <CardContent className='size-52'></CardContent>
      </Card>
      <RecipientsCard onAdd={() => setOpen(true)} recipients={recipients} />
      <RecipientSheet open={open} setOpen={setOpen} onSubmit={handleSubmit} />
    </div>
  );
};
