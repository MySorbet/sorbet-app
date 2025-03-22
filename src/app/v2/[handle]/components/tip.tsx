import { Coffee, Plug, Unplug, Wallet } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
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

  return (
    <div className='flex w-full flex-col gap-2'>
      {!isOpen && (
        <Button variant='secondary' onClick={() => setIsOpen(true)}>
          <Coffee /> Tip USDC
        </Button>
      )}
      {isOpen && (
        <Card className='animate-in fade-in-0 slide-in-from-top-5 flex w-full flex-col gap-2 p-4 duration-300'>
          {wallet && (
            <div className='flex items-center justify-between gap-2'>
              <Badge variant='success' className='w-fit'>
                <Wallet className='mr-1 size-3' />
                Connected to {formatWalletAddress(wallet?.address)}
              </Badge>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size='icon'
                      variant='ghost'
                      onClick={() => wallet?.disconnect()}
                    >
                      <Unplug />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Disconnect this wallet</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
          {!wallet && (
            <div className='flex w-full items-center justify-between gap-2'>
              <Badge variant='secondary' className='w-fit'>
                <Unplug className='mr-1 size-3' />
                Not connected
              </Badge>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size='icon' variant='ghost' onClick={connectWallet}>
                    <Plug />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Connect a wallet</TooltipContent>
              </Tooltip>
            </div>
          )}
          <div className='flex w-full gap-2'>
            <Input
              type='number'
              placeholder='Amount'
              value={amount}
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
              <Coffee /> {`Tip ${amount} USDC`}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
