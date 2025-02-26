import { Plus, Send } from 'lucide-react';

import { Header } from '@/components/common/header';
import { Button } from '@/components/ui/button';

// TODO: Either callback handlers or handle deposit/send here

/** Specialized composable header for the wallet page */
export const WalletHeader = () => {
  return (
    <Header title='Wallet'>
      <div className='flex items-center gap-2'>
        <Button variant='outline'>
          <Plus className='size-4' />
          Deposit
        </Button>
        <Button variant='sorbet'>
          <Send className='size-4' />
          Send Funds
        </Button>
      </div>
    </Header>
  );
};
