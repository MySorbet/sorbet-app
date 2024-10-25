import type { Metadata } from 'next';

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
            <SorbetBlob className='absolute left-1/2 top-1/2 size-5/6 -translate-x-1/2 -translate-y-[60%] transform opacity-75' />
            <h1 className='relative z-10 text-4xl text-white drop-shadow-md'>
              Gigs are coming back soon!
            </h1>
          </div>
          <div className='flex w-3/4 items-center justify-center gap-4'>
            <a>
              <InstagramIcon />
            </a>
            <a>
              <TwitterIcon />
            </a>
          </div>
        </div>
      )}
    </>
  );
}
