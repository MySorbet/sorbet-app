'use client';

import Header from '@/components/Header/userHeader';

const Gigs = () => {
  return (
    <>
      <div className='bg-secondary h-screen w-full items-center justify-center'>
        <Header />
        <div className='container m-auto flex h-1/2 items-start justify-center gap-6 p-2.5 pl-6 pr-10 pt-[127px]'>
          <div className='grid grid-cols-4 gap-6'>explore</div>
        </div>
      </div>
    </>
  );
};

export default Gigs;
