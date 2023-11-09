import Image from 'next/image';

import './header.css';

const Header = () => {
  return (
    <div
      id='header'
      className='header-width fixed z-10 flex flex-col justify-center rounded-lg bg-white p-4'
    >
      <div className='itesm-center self-strech flex h-10 justify-between'>
        <div className='flex w-[152px] items-center gap-2'>
          <Image src='/images/logo.png' alt='logo' width={34} height={34} />
          <div className='font-sans text-base font-semibold leading-normal text-[#6230EC]'>
            SORBET
          </div>
        </div>
        <div className='flex items-center gap-12 font-semibold'>
          <div className='flex flex-col items-start gap-1'>Profile</div>
          <div className='flex flex-col items-start gap-1'>Gigs</div>
          <div className='flex flex-col items-start gap-1'>Explore</div>
        </div>
        <div className='flex'>
          <img
            src='/images/avatar.png'
            alt='avatar'
            width='40px'
            height='40px'
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
