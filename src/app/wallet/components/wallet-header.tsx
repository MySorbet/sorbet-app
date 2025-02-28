import { Plus, Send } from 'lucide-react';

import { Header } from '@/components/common/header';
import { Button } from '@/components/ui/button';

/** Specialized composable header for the wallet page */
export const WalletHeader = ({
  onDeposit,
  onSend,
}: {
  onDeposit?: () => void;
  onSend?: () => void;
}) => {
  return (
    <Header title='Wallet' className='@container'>
      <div className='flex items-center gap-2'>
        <Button variant='outline' onClick={onDeposit} aria-label='Deposit'>
          <Plus className='size-4' />
          <span className='@sm:inline hidden'>Deposit</span>
        </Button>
        <Button variant='sorbet' onClick={onSend} aria-label='Send Funds'>
          <Send className='size-4' />
          <span className='@sm:inline hidden'>Send Funds</span>
        </Button>
      </div>
    </Header>
  );
};
