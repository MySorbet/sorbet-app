import type { Metadata } from 'next';
import Image from 'next/image';

import {
  InstagramIcon,
  TwitterIcon,
} from '@/components/profile/share/components';
import { featureFlags } from '@/lib/flags';
import SorbetBlob from '~/svg/sorbet-blob.svg';

import { GigsContainer } from './gigs-container';

export const metadata: Metadata = {
  title: 'Gigs',
};

export default function GigsPage() {
  return (
    <>
      {featureFlags.gigs ? (
        <GigsContainer />
      ) : (
        <div className='bg-sorbet/25 flex h-full w-full flex-col items-center justify-center'>
          <div className='relative flex size-3/4 items-center justify-center '>
            <SorbetBlob className='absolute left-1/2 top-1/2 size-5/6 -translate-x-1/2 -translate-y-[50%] transform opacity-75 md:-translate-y-[60%]' />
            <h1 className='relative z-10 text-2xl text-white drop-shadow-md md:text-4xl'>
              Gigs are coming back soon!
            </h1>
          </div>
          <div className='flex w-3/4 items-center justify-center gap-4'>
            <a
              href='https://mysorbet.xyz'
              target='_blank'
              rel='noopener noreferrer'
            >
              <Image
                src='/svg/logo.svg'
                height={52}
                width={52}
                alt='Sorbet logo'
                className='size-10'
              />
            </a>
            <a
              href='https://www.instagram.com/mysorbet.xyz/'
              target='_blank'
              rel='noopener noreferrer'
            >
              <InstagramIcon className='size-10' />
            </a>
            <a
              href='https://x.com/mysorbetxyz'
              target='_blank'
              rel='noopener noreferrer'
              className='size-10'
            >
              <TwitterIcon />
            </a>
          </div>
        </div>
      )}
    </>
  );
}
