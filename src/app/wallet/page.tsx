'use client';

import { CreditCardForm } from '@/app/wallet/credit-card';
import { WalletContainer } from '@/app/wallet/wallet-container';
import { Sidebar } from '@/components';
import { Header } from '@/components/header';
import { useAuth } from '@/hooks';
import { useAppSelector } from '@/redux/hook';

const Home = () => {
  const { user } = useAuth();
  const { toggleOpenSidebar } = useAppSelector((state) => state.userReducer);

  return (
    <>
      <Header />
      {user && <Sidebar show={toggleOpenSidebar} userInfo={user} />}
      <div className='container my-24'>
        <div className='flex flex-col lg:flex-row gap-6'>
          <div className='lg:w-1/3'>
            <CreditCardForm />
          </div>
          <div className='lg:w-2/3'>
            <WalletContainer />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
