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
    <div className='min-h-[100%] min-w-[360px] rounded-2xl bg-white p-6 shadow-md'>
      <div className='flex items-center gap-2'>
        <span className='rounded-full bg-black p-2 text-white'>
          <Bank className='size-[1.125rem]' />
        </span>
        <span className='text-md font-medium text-[#595B5A]'>MY ACCOUNTS</span>
      </div>
      <div className='my-4 h-[1px] w-full bg-[#F2F2F2]' />
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
    <div className='flex gap-2 rounded-xl border border-[#EFEFEF] p-3'>
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
          <div className='flex items-center gap-2 text-[#344054]'>
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
