'use client';

import { CopyIconButton } from '@/components/common/copy-button/copy-icon-button';
import Logo from '~/svg/logo.svg';

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
        <Logo className='size-8' alt='Sorbet logo' />
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
