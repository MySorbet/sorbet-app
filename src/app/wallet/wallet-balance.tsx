import { Plus, Send, Wallet } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';

interface WalletBalanceProps {
  ethBalance: string;
  usdcBalance: string;
  onTopUp: () => void;
  onSend: () => void;
}

/**
 * Renders a users wallet balance and provides options to top up or send funds
 * Currently, top up and send are disabled
 */
export const WalletBalance: React.FC<WalletBalanceProps> = ({
  ethBalance,
  usdcBalance,
  onTopUp,
  onSend,
}) => {
  return (
    <div className='min-h-[100%] min-w-80 rounded-3xl bg-white p-6 shadow-[0px_10px_30px_0px_#00000014]'>
      <div className='flex flex-col gap-1'>
        <div className='flex items-center justify-between'>
          <div className='flex flex-col gap-3'>
            <div className='flex items-center gap-2'>
              <span className='rounded-full bg-black p-2 text-white'>
                <Wallet size={18} />
              </span>
              <span className='text-md font-medium text-[#595B5A]'>
                BALANCE
              </span>
            </div>
          </div>
          <div className='flex gap-4'>
            <CircleButton
              icon={<Plus size={26} />}
              label='Top up'
              onClick={onTopUp}
            />
            <CircleButton
              icon={<Send size={26} />}
              label='Send'
              onClick={onSend}
            />
          </div>
        </div>
        <div className='flex'>
          {/* <div className='text-3xl font-semibold'>{ethBalance} ETH</div> */}
          <div className='text-3xl font-semibold'>{usdcBalance} USDC</div>
        </div>
      </div>
    </div>
  );
};

const CircleButton: React.FC<{
  icon: React.ReactNode;
  label?: string;
  onClick?: () => void;
}> = ({ icon, label, onClick }) => {
  return (
    <div className='flex h-auto w-auto flex-col items-center gap-1 p-0'>
      <Button
        className='bg-sorbet flex size-12 items-center justify-center rounded-full p-0 text-white'
        onClick={onClick}
        disabled // TODO: Enable when functionality is implemented
      >
        {icon}
      </Button>
      {label && <span className='text-sm text-[#595B5A]'>{label}</span>}
    </div>
  );
};
