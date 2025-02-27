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
    <Header title='Wallet'>
      <div className='flex items-center gap-2'>
        <Button variant='outline' onClick={onDeposit}>
          <Plus className='size-4' />
          Deposit
        </Button>
        <Button variant='sorbet' onClick={onSend}>
          <Send className='size-4' />
          Send Funds
        </Button>
      </div>
    </Header>
  );
};
