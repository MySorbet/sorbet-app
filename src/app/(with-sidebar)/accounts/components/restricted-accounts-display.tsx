'use client';

import Image from 'next/image';
import { CircleFlag } from 'react-circle-flags';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/**
 * Display all accounts with "Coming Soon" badges for restricted country users.
 * Shows USD, EUR, and AED accounts in a horizontal layout with no interaction.
 */
export const RestrictedAccountsDisplay = ({
  className,
}: {
  className?: string;
}) => {
  return (
    <div className={cn('flex flex-col gap-2 sm:flex-row', className)}>
      {/* USD Coming Soon Card */}
      <div className='flex h-fit flex-1 items-center gap-1.5 rounded-md border p-6 text-sm'>
        <CircleFlag countryCode='us' className='size-10' />
        <div className='flex-1 text-left font-semibold'>
          <span className='uppercase'>USD</span>
          <span> account</span>
        </div>
        <Badge className='bg-[#E4E4E7] text-foreground hover:bg-[#E4E4E7]'>
          Coming Soon
        </Badge>
      </div>

      {/* EUR Coming Soon Card */}
      <div className='flex h-fit flex-1 items-center gap-1.5 rounded-md border p-6 text-sm'>
        <CircleFlag countryCode='eu' className='size-10' />
        <div className='flex-1 text-left font-semibold'>
          <span className='uppercase'>EUR</span>
          <span> account</span>
        </div>
        <Badge className='bg-[#E4E4E7] text-foreground hover:bg-[#E4E4E7]'>
          Coming Soon
        </Badge>
      </div>

      {/* AED Coming Soon Card */}
      <div className='flex h-fit flex-1 items-center gap-1.5 rounded-md border p-6 text-sm'>
        <Image
          src='/svg/AED-icon.svg'
          alt='AED flag'
          width={40}
          height={40}
          className='size-10'
        />
        <div className='flex-1 text-left font-semibold'>
          <span className='uppercase'>AED</span>
          <span> account</span>
        </div>
        <Badge className='bg-[#E4E4E7] text-foreground hover:bg-[#E4E4E7]'>
          Coming Soon
        </Badge>
      </div>
    </div>
  );
};
