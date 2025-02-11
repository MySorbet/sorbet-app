import { Bank, Wallet03 } from '@untitled-ui/icons-react';
import Image from 'next/image';

import { CopyIconButton } from '@/components/common/copy-button/copy-icon-button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { formatCurrency, formatWalletAddress } from './utils';

interface MyAccountsProps {
  usdcBalance: string;
  address: string | null;
  isLoading: boolean;
}

export const MyAccounts: React.FC<MyAccountsProps> = ({
  usdcBalance,
  address,
  isLoading,
}) => {
  return (
    <>
      {isLoading || usdcBalance === '' ? (
        <Skeleton className='h-[366px] rounded-2xl' />
      ) : (
        <Card className='min-h-full min-w-72 rounded-2xl p-6'>
          <div className='flex items-center gap-2'>
            <span className='bg-foreground text-muted rounded-full p-2'>
              <Bank className='size-[1.125rem]' />
            </span>
            <span className='text-md font-medium text-[#595B5A]'>
              MY ACCOUNTS
            </span>
          </div>
          <div className='bg-border my-4 h-[1px] w-full' />

          <USDCAccountItem
            icon={<Wallet03 className='size-3' />}
            address={address}
            balance={usdcBalance}
          ></USDCAccountItem>
        </Card>
      )}
    </>
  );
};

const USDCAccountItem: React.FC<{
  icon: React.ReactNode;
  balance: string;
  address: string | null;
}> = ({ icon, balance, address }) => {
  return (
    <div className='border-border flex gap-2 rounded-xl border p-3'>
      <Image
        src='/svg/base-usdc.svg'
        priority={true}
        width={35}
        height={35}
        alt='usdc logo'
        className='flex-shrink-0'
      />
      <div className='flex flex-col'>
        <div className='font-semibold'>USDC</div>
        {address && (
          <div className='text-muted-foreground flex items-center gap-2'>
            {icon}
            <div className='text-xs'>{formatWalletAddress(address)}</div>
            <CopyIconButton
              copyIconClassName='size-3'
              checkIconClassName='size-3'
              stringToCopy={address ?? ''}
            />
          </div>
        )}
      </div>
      <div className='ml-auto'>${formatCurrency(balance)}</div>
    </div>
  );
};
