'use client';

import Image from 'next/image';

import Logo from '@/../public/images/logo.png';
import { CopyIconButton } from '@/components/common/copy-button/copy-icon-button';

export const ShareLink = ({
  username,
  handleUrlToClipboard,
}: {
  username: string;
  handleUrlToClipboard: () => void;
}) => {
  const hostname = window.location.hostname;

  return (
    <div className='flex h-[68px] w-full items-center justify-between rounded-md border-2 border-[#D0D5DD] bg-[#FFFFFF] px-5'>
      <div className='flex items-center gap-3'>
        <Image
          src={Logo}
          height={32}
          width={32}
          className='size-8'
          alt='Sorbet logo'
        />
        <p className='truncate text-base font-medium text-[#101828]'>
          {`${hostname}/${username}`}
        </p>
      </div>
      <CopyIconButton
        onCopy={handleUrlToClipboard}
        copyIconClassName='size-7 text-[#101828]'
        checkIconClassName='size-7'
      />
    </div>
  );
};
