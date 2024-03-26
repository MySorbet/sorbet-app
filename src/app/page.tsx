'use client';

import { Sidebar } from '@/components';
import { Header } from '@/components/header';
import { Profile } from '@/components/profile';
import { useAuth } from '@/hooks';

const Home = () => {
  const { user } = useAuth();

  return (
    <>
      <Header />
      {user && <Sidebar show={true} userInfo={user} />}
      <div>
        <Profile />
      </div>
    </>
  );
};

export default Home;
