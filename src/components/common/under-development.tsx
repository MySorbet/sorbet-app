import Image from 'next/image';

import {
  InstagramIcon,
  TwitterIcon,
} from '@/components/profile/share/components';
import SorbetBlob from '~/svg/sorbet-blob.svg';

export const UnderDevelopment = ({ featureName }: { featureName: string }) => {
  return (
    <div className='flex h-full w-full flex-col items-center justify-start'>
      <div className='flex size-[600px] flex-col items-center justify-start md:size-3/4 '>
        <SorbetBlob className='size-3/4' />
        <h1 className='text-2xl text-black md:text-4xl'>
          {featureName} under development
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
  );
};
