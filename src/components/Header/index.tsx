import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import './header.css';

const Header = () => {
  const router = useRouter();
  const [selected, setSelected] = useState('profile');

  useEffect(() => {
    setSelected(window.location.href.slice(22));
  }, [router]);

  return (
    <div className='header-width fixed z-10 flex flex-col justify-center rounded-lg bg-white p-4'>
      <div className='self-strech flex h-10 items-center justify-between'>
        <div
          className='flex cursor-pointer items-center gap-2'
          onClick={() => router.push('/profile')}
        >
          <img src='/svg/logo.svg' alt='logo' width={34} height={34} />
          <div className='font-sans text-base font-semibold leading-normal text-[#6230EC]'>
            SORBET
          </div>
        </div>
        <div className='flex items-center gap-12 font-semibold max-sm:gap-4'>
          <div
            className={`hover:text-primary-default flex cursor-pointer flex-col items-start gap-1 ${
              selected == 'profile' &&
              'border-b-2 border-[#6230Ec] text-[#6230EC]'
            }`}
            key={1}
            onClick={() => {
              router.push('/profile');
            }}
          >
            Profile
          </div>
          <div
            className={`hover:text-primary-default flex cursor-pointer flex-col items-start gap-1 ${
              selected == 'gigs' && 'border-b-2 border-[#6230Ec] text-[#6230EC]'
            }`}
            key={2}
            onClick={() => {
              router.push('/gigs');
            }}
          >
            Gigs
          </div>
          <div
            className={`hover:text-primary-default flex cursor-pointer flex-col items-start gap-1 ${
              selected == 'explore' &&
              'border-b-2 border-[#6230Ec] text-[#6230EC]'
            }`}
            key={3}
            onClick={() => {
              router.push('/explore');
            }}
          >
            Explore
          </div>
        </div>
        <div className='flex'>
          <img
            src='/avatar.svg'
            alt='avatar'
            className='cursor-pointer'
            width={40}
            height={40}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
