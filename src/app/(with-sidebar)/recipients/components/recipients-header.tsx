'use client';

import { Plus } from 'lucide-react';
import Link from 'next/link';

import { Header } from '@/components/common/header';
import { Button } from '@/components/ui/button';

/** Specialized composable header for the recipients page */
export const RecipientsHeader = ({ onAdd }: { onAdd?: () => void }) => {
  return (
    <Header
      title='Recipients'
      subtitle='Add crypto wallets and bank accounts'
      className='@container'
    >
      <div className='flex items-center gap-2'>
        <Button variant='outline' asChild>
          <Link href='https://docs.mysorbet.xyz/' target='_blank'>
            Docs
          </Link>
        </Button>
        <Button variant='sorbet' onClick={onAdd} aria-label='Add Recipient'>
          <Plus />
          <span className='@sm:inline hidden'>Add</span>
        </Button>
      </div>
    </Header>
  );
};
