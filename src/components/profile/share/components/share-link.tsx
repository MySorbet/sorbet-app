'use client';

import { CheckCircle, Copy05 } from '@untitled-ui/icons-react';
import Image from 'next/image';
import { useState } from 'react';

import Logo from '@/../public/images/logo.png';
import { Button } from '@/components/ui/button';

export const ShareLink = ({
  username,
  handleUrlToClipboard,
}: {
  username: string;
  handleUrlToClipboard: () => void;
}) => {
  const [isCopied, setIsCopied] = useState(false);

  return (
    <div className='flex h-[68px] w-full items-center justify-between rounded-md border-2 border-[#D0D5DD] bg-[#FFFFFF] px-5'>
      <div className='flex items-center gap-3'>
        <Image src={Logo} height={32} width={32} alt='logo' />
        <p className='text-base font-medium text-[#101828]'>
          {username.length > 10
            ? `mysorbet.xyz/${username.slice(0, 10)}...`
            : `mysorbet.xyz/${username}`}
        </p>
      </div>

      <Button
        className='group m-0 border-none bg-transparent p-0 hover:bg-transparent'
        onClick={() => {
          setIsCopied(true);
          handleUrlToClipboard();
        }}
        disabled={isCopied}
      >
        {isCopied ? (
          <CheckCircle className='h-6 w-6 text-green-500' />
        ) : (
          <Copy05 className='h-6 w-6 text-[#101828] ease-out group-hover:scale-105 ' />
        )}
      </Button>
    </div>
  );
};
