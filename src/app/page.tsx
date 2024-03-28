'use client';

import { Sidebar } from '@/components';
import { Header } from '@/components/header';
import { Profile } from '@/components/profile';
import { useAuth } from '@/hooks';
import { useAppSelector } from '@/redux/hook';

const Home = () => {
  const { user } = useAuth();
  const { toggleOpenSidebar } = useAppSelector((state) => state.userReducer);

  return (
    <>
      <Header />
      {user && <Sidebar show={toggleOpenSidebar} userInfo={user} />}
      <div>
        <Profile />
      </div>
    </>
  );
};

export default Home;
