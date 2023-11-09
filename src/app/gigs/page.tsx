'use client';

import Image from 'next/image';
import Header from '@/components/Header/index';

const Gigs = () => {
  return (
    <>
      <div className='h-screen w-full items-center justify-center bg-[#F2F2F2]'>
        <Header />
        <div className='container m-auto flex h-1/2 h-[calc(100vh-68px)] items-start  justify-center gap-6 p-2.5 pl-6 pr-10 pt-[127px]'>
          <div className='self-strech flex h-full w-1/3 flex-col items-start gap-4 rounded-lg bg-[white] px-4 pb-4 pt-2'>
            <div className='flex w-full items-center justify-between'>
              <div className='text-sm font-normal'>Offers</div>
              <div className='flex h-6 w-6 items-center justify-center rounded-full bg-gray-200'>
                1
              </div>
            </div>
            <div className='flex w-full flex-col gap-2 rounded-lg rounded-lg bg-[#FAFAFA] p-4'>
              <div className='flex w-full items-center justify-start gap-2'>
                <Image src='/avatar.svg' alt='avatar' width={32} height={32} />
                <p className='text-xs'>Request User</p>
              </div>
              <div className='gap-0.75 flex w-full flex-col'>
                <div className='text-sm font-normal font-semibold'>
                  Branding reDesign
                </div>
                <div className='text-xs font-normal'>
                  I need a rebrand for my startup, new logo, typography, brand
                  style guide, and asset libra...
                </div>
              </div>
            </div>
          </div>
          <div className='self-strech flex h-full w-1/3 flex-col items-start gap-4 rounded-lg bg-[white] px-4 pb-4 pt-2 max-sm:w-full'>
            <div className='flex w-full items-center justify-between'>
              <div className='text-sm font-normal'>In-progress</div>
              <div className='flex h-6 w-6 items-center justify-center rounded-full bg-gray-200'>
                0
              </div>
            </div>
          </div>
          <div className='self-strech flex h-full w-1/3 flex-col items-start gap-4 rounded-lg bg-[white] px-4 pb-4 pt-2 max-sm:w-full'>
            <div className='flex w-full items-center justify-between'>
              <div className='text-sm font-normal'>Completed</div>
              <div className='flex h-6 w-6 items-center justify-center rounded-full bg-gray-200'>
                0
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Gigs;
