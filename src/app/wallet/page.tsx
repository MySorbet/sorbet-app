'use client';

import Container from '@/app/container';
import { CreditCardForm } from '@/app/wallet/credit-card';
import { FundsFlow } from '@/app/wallet/funds-flow';
import { RecentTransactions } from '@/app/wallet/recent-transactions';
import { SelectDuration } from '@/app/wallet/select-duration';
import { WalletBalance } from '@/app/wallet/wallet-balance';
import { Sidebar } from '@/components';
import { PageTitle } from '@/components/common';
import { Header } from '@/components/header';
import { useAuth } from '@/hooks';
import { useAppSelector } from '@/redux/hook';
import { MoveDown, Send } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();
  const { toggleOpenSidebar } = useAppSelector((state) => state.userReducer);

  return (
    <Container>
      <Header />
      <PageTitle title='Wallet' />
      {user && <Sidebar show={toggleOpenSidebar} userInfo={user} />}
      <div className='container my-16'>
        <div className='flex flex-col lg:flex-row gap-6'>
          <div className='lg:w-8/12'>
            <WalletBalance />
          </div>
          <div className='lg:w-4/12'>
            <CreditCardForm />
          </div>
        </div>
        <div className='flex justify-between mt-12 mb-6'>
          <div className='text-2xl font-semibold'>Money Movements</div>
          <div>
            <SelectDuration
              selectedValue='30'
              onChange={(value: string) => console.log(value)}
            />
          </div>
        </div>
        <div className='flex flex-col lg:flex-row gap-6'>
          <div className='lg:w-1/2'>
            <FundsFlow
              title='Money In'
              balance='12,568 USDC'
              icon={<MoveDown size={16} />}
            />
          </div>
          <div className='lg:w-1/2'>
            <FundsFlow
              title='Money Out'
              balance='12,568 USDC'
              icon={<Send size={16} />}
            />
          </div>
        </div>
        <div className='flex flex-col mt-12'>
          <div className='flex justify-between items-center mb-6'>
            <div className='text-2xl font-semibold'>Recent Transactions</div>
            <div className='text-right font-semibold text-sm cursor-pointer text-sorbet'>
              View all
            </div>
          </div>
          <RecentTransactions />
        </div>
      </div>
    </Container>
  );
};

export default Home;
