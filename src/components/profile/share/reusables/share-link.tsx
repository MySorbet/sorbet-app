import { Copy05 } from '@untitled-ui/icons-react';
import Image from 'next/image';

import Logo from '@/../public/images/logo.png';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export const ShareLink = ({
  username,
  handleUrlToClipboard,
}: {
  username: string;
  handleUrlToClipboard: () => void;
}) => {
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
      <Popover>
        <PopoverTrigger>
          <Button
            className='group m-0 border-none bg-transparent p-0 hover:bg-transparent'
            onClick={handleUrlToClipboard}
          >
            <Copy05 className='h-7 w-7 text-black ease-out group-hover:scale-105 ' />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className='h-fit w-fit p-2 text-sm'
          side='bottom'
          sideOffset={0}
        >
          Link copied!
        </PopoverContent>
      </Popover>
    </div>
  );
};
