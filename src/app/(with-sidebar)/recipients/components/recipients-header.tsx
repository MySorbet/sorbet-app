'use client';

import { Plus } from 'lucide-react';

import { DocsButton } from '@/components/common/docs-button';
import { Header } from '@/components/common/header';
import { Button } from '@/components/ui/button';

import { useAddRecipientOpen } from '../hooks/use-add-recipient-open';

/** Specialized composable header for the recipients page */
export const RecipientsHeader = () => {
  const [, setAddOpen] = useAddRecipientOpen();

  return (
    <Header
      title='Recipients'
      subtitle='Add crypto wallets and bank accounts'
      className='@container'
    >
      <div className='flex items-center gap-2'>
        <DocsButton />
        <Button
          variant='sorbet'
          onClick={() => setAddOpen(true)}
          aria-label='Add Recipient'
        >
          <Plus />
          <span className='@sm:inline hidden'>Add</span>
        </Button>
      </div>
    </Header>
  );
};
