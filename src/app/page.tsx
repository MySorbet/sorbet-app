'use client';

import { Header } from '@/components/header';
import { Profile } from '@/components/profile';

const RedirectScreen = () => {
  return (
    <>
      <Header />
      <div className='container mx-auto py-4'>
        <Profile />
      </div>
    </>
  );
};

export default RedirectScreen;
