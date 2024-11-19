import { AccountModal } from '@/app/wallet/usdc-modal';
import { CopyIconButton } from '@/components/common/copy-button/copy-icon-button';
import { Bank, Copy06, Wallet03 } from '@untitled-ui/icons-react';
import Image from 'next/image';
import { useState } from 'react';

interface MyAccountsProps {
  usdcBalance: string;
}

export const MyAccounts: React.FC<MyAccountsProps> = ({ usdcBalance }) => {
  return (
    <div className='min-h-[100%] min-w-[360px] rounded-2xl bg-white p-6 shadow-[0_16px_50px_0px_rgba(0,0,0,0.15)]'>
      <div className='flex items-center gap-2'>
        <span className='rounded-full bg-black p-2 text-white'>
          <Bank width={18} height={18} />
        </span>
        <span className='text-md font-medium text-[#595B5A]'>MY ACCOUNTS</span>
      </div>
      <div>
        <AccountItem
          icon={<Wallet03 width={12} height={12} />}
          address='jnfkjsnfjkdsfsdf'
          type='USDC'
          balance={usdcBalance}
        ></AccountItem>
      </div>
    </div>
  );
};

const AccountItem: React.FC<{
  icon: React.ReactNode;
  balance: string;
  type: string;
  address: string;
}> = ({ icon, balance, type, address }) => {
  const [showAccountModal, setShowAccountModal] = useState<boolean>(false);
  const handleAccountEdit = () => {
    setShowAccountModal((prev) => !prev);
  };

  const handleAccountModalVisible = (open: boolean) => {
    setShowAccountModal(open);
  };
  const truncatedAddress = `${address.slice(0, 5)}...${address.slice(-5)}`;
  return (
    <div className='flex gap-2 rounded-xl border border-[#EFEFEF] p-3'>
      <Image src='/svg/base-usdc.svg' width={35} height={35} alt='usdc logo' />
      <div className='flex flex-col'>
        <div>{type.toLocaleUpperCase()}</div>
        <div className='flex items-center gap-1'>
          {icon}
          <div className='text-xs'>{truncatedAddress}</div>
          <Copy06 onClick={handleAccountEdit} width={12} height={12} />
        </div>
      </div>
      <div className='ml-auto'>{balance}</div>
      <AccountModal
        accountModalVisible={showAccountModal}
        handleModalVisible={handleAccountModalVisible}
        address='jnfkjsnfjkdsfsdf'
      />
    </div>
  );
};

/**
 * sidebar.tsx
 * const truncatedAddress = `${smartWalletAddress.slice(
    0,
    5
  )}...${smartWalletAddress.slice(-5)}`;
  return (
    <div className='text-muted-foreground flex flex-row items-center gap-1 text-xs'>
      <span>{truncatedAddress}</span>
      <CopyIconButton
        onCopy={() => {
          navigator.clipboard.writeText(smartWalletAddress);
        }}
      />
    </div>
  );
 */
