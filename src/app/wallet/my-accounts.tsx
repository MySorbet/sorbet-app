import { Bank, Copy06, Wallet03 } from '@untitled-ui/icons-react';
import Image from 'next/image';
import { useState } from 'react';

import { AccountModal } from '@/app/wallet/account-modal';
import { formatCurrency, formatWalletAddress } from '@/app/wallet/utils';

interface MyAccountsProps {
  usdcBalance: string;
  address: string | null;
}

export const MyAccounts: React.FC<MyAccountsProps> = ({
  usdcBalance,
  address,
}) => {
  return (
    <div className='bg-background min-h-[100%] min-w-[360px] rounded-2xl p-6 shadow-md'>
      <div className='flex items-center gap-2'>
        <span className='bg-foreground text-muted rounded-full p-2'>
          <Bank className='size-[1.125rem]' />
        </span>
        <span className='text-md font-medium text-[#595B5A]'>MY ACCOUNTS</span>
      </div>
      <div className='bg-border my-4 h-[1px] w-full' />
      <div>
        {/** for now, it's only USDC but this will be refactored into multiple account items */}
        <USDCAccountItem
          icon={<Wallet03 className='size-3' />}
          address={address}
          balance={usdcBalance}
        ></USDCAccountItem>
      </div>
    </div>
  );
};

const USDCAccountItem: React.FC<{
  icon: React.ReactNode;
  balance: string;
  address: string | null;
}> = ({ icon, balance, address }) => {
  const [isOpen, setisOpen] = useState<boolean>(false);

  const handleAccountEdit = () => {
    setisOpen((prev) => !prev);
  };

  const handleOpenChange = (open: boolean) => {
    setisOpen(open);
  };

  return (
    <div className='border-border flex gap-2 rounded-xl border p-3'>
      <Image
        src='/svg/base-usdc.svg'
        priority={true}
        width={35}
        height={35}
        alt='usdc logo'
      />
      <div className='flex flex-col'>
        <div className='font-semibold'>USDC</div>
        {address && (
          <div className='text-muted-foreground flex items-center gap-2'>
            {icon}
            <div className='text-xs'>{formatWalletAddress(address)}</div>
            <Copy06
              onClick={handleAccountEdit}
              className='size-3 cursor-pointer'
            />
          </div>
        )}
      </div>
      <div className='ml-auto'>${formatCurrency(balance)}</div>
      <AccountModal
        isOpen={isOpen}
        handleOpenChange={handleOpenChange}
        address={address}
      />
    </div>
  );
};
