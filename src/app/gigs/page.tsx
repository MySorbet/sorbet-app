'use client';

// import Sidebar from '@/components/Sidebar/index';
import Header from '@/components/Header/index';

// import './profile.css';

const Gigs = () => {
  return (
    <>
      <div className='relative z-10 h-full w-full bg-[#FAFAFA]'>
        <div className='flex w-full items-center justify-center'>
          <Header />
          <div className='w-full '></div>
          <div className='flex w-full flex-col items-center gap-6 p-2.5'>
            <div className='self-strech width-[300px] flex items-start gap-4 px-4 pb-4 pt-2'>
              <div className='flex items-center justify-between'>
                <div className='text-sm font-normal'>Sent</div>
                <div className='h-6 w-6 rounded-full p-2.5'>1</div>
              </div>
              <div className='flex flex-col flex-col gap-2 rounded-lg p-4'>
                <div className='flex items-center gap-2'>
                  <img src='/images/avatar.png' width={32} height={32} />
                </div>
                <p className='text-xs'>Request User</p>
              </div>
              <div className='gap-0.75 flex'>
                <div className='text-semibold text-sm font-normal'>
                  Branding reDesign
                </div>
                <div className='text-xs font-normal'>
                  I need a rebrand for my startup, new logo, typography, brand
                  style guide, and asset libra...
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Gigs;
