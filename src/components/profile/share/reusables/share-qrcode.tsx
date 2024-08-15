import { Copy } from 'lucide-react';
import Image from 'next/image';

import Logo from '@/../public/images/logo.png';

export const QRCode = ({ username }: { username: string }) => {
  return (
    <div className='flex h-[68px] w-full items-center justify-between rounded-md border-2 border-[#D0D5DD] bg-[#FFFFFF] px-5'>
      <div className='flex items-center gap-3'>
        <Image src={Logo} height={32} width={32} alt='logo' />
        <p className='text-base font-medium text-[#101828]'>
          mysorbet.xyz/{username}
        </p>
      </div>
      <Copy className='h-8 w-8' />
    </div>
  );
};
