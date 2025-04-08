import { Coffee, Unplug, Wallet } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useWalletAddressByUserId } from '@/hooks/use-wallet-address-by-user-id';
import { formatWalletAddress } from '@/lib/utils';

import { useConnectAndSend } from '../hooks/use-connect-and-send';

/** Tip button which expands to a card allowing users to connect and send USDC */
export const Tip = ({ userId }: { userId: string }) => {
  const { data: walletAddress } = useWalletAddressByUserId(userId);
  const { wallet, connectWallet, send } = useConnectAndSend({
    amount: 1,
    recipientWalletAddress: walletAddress,
    // recipientWalletAddress: '0xBB5923098D84EB0D9DAaE2975782999364CE87A2', //uncomment for SB,
    sendAfterConnect: false,
  });

  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState(0);

  return !isOpen ? (
    <Button variant='secondary' onClick={() => setIsOpen(true)}>
      <Coffee /> Tip USDC
    </Button>
  ) : (
    <Card className='animate-in fade-in-0 slide-in-from-top-5 @container flex w-full flex-col gap-2 p-4 duration-300'>
      {wallet ? (
        <Tooltip>
          <TooltipTrigger className='w-fit'>
            <Badge
              variant='success'
              className='w-fit select-none py-1'
              onClick={() => {
                wallet.disconnect();
              }}
            >
              <Wallet className='mr-1 size-3 shrink-0' />
              {formatWalletAddress(wallet?.address)}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>Disconnect this wallet</TooltipContent>
        </Tooltip>
      ) : (
        <Tooltip>
          <TooltipTrigger className='w-fit'>
            <Badge
              variant='secondary'
              className='w-fit select-none py-1'
              onClick={connectWallet}
            >
              <Unplug className='mr-1 size-3 shrink-0' />
              Connect
            </Badge>
          </TooltipTrigger>
          <TooltipContent>Connect a wallet to tip</TooltipContent>
        </Tooltip>
      )}
      <div className='@2xs:flex-row flex w-full flex-col gap-2'>
        <Input
          type='number'
          placeholder='Amount'
          value={String(amount)}
          onChange={(e) => setAmount(Number(e.target.value))}
          className='no-spin-buttons w-24'
          disabled={!wallet}
        />
        <Button
          variant='secondary'
          className='flex-1'
          onClick={send}
          disabled={!wallet || amount === 0}
        >
          <Coffee /> {`Tip ${amount || ''} USDC`}
        </Button>
      </div>
    </Card>
  );
};
