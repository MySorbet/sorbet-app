import { AccountModal } from '@/app/wallet/account-modal';
import { Bank, Copy06, Wallet03 } from '@untitled-ui/icons-react';
import Image from 'next/image';
import { useState } from 'react';

interface MyAccountsProps {
  usdcBalance: string;
  address: string | null;
}

export const MyAccounts: React.FC<MyAccountsProps> = ({
  usdcBalance,
  address,
}) => {
  return (
    <div className='min-h-[100%] min-w-[360px] rounded-2xl bg-white p-6 shadow-[0_16px_50px_0px_rgba(0,0,0,0.15)]'>
      <div className='flex items-center gap-2'>
        <span className='rounded-full bg-black p-2 text-white'>
          <Bank width={18} height={18} />
        </span>
        <span className='text-md font-medium text-[#595B5A]'>MY ACCOUNTS</span>
      </div>
      <div className='divider my-4 h-[1px] w-full bg-[#F2F2F2]' />
      <div>
        {/** for now, it's only USDC but this will be refactored into multiple account items */}
        <USDCAccountItem
          icon={<Wallet03 width={12} height={12} />}
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
  const truncatedAddress = `${address?.slice(0, 5)}...${address?.slice(-5)}`;
  const [showAccountModal, setShowAccountModal] = useState<boolean>(false);

  const handleAccountEdit = () => {
    setShowAccountModal((prev) => !prev);
  };

  const handleAccountModalVisible = (open: boolean) => {
    setShowAccountModal(open);
  };

  return (
    <div className='flex gap-2 rounded-xl border border-[#EFEFEF] p-3'>
      <Image src='/svg/base-usdc.svg' width={35} height={35} alt='usdc logo' />
      <div className='flex flex-col'>
        <div>USDC</div>
        {address && (
          <div className='flex items-center gap-2'>
            {icon}
            <div className='text-xs'>{truncatedAddress}</div>
            <Copy06 onClick={handleAccountEdit} width={12} height={12} />
          </div>
        )}
      </div>
      <div className='ml-auto'>${Number(balance).toLocaleString()}</div>
      <AccountModal
        accountModalVisible={showAccountModal}
        handleModalVisible={handleAccountModalVisible}
        address={address}
      />
    </div>
  );
};
