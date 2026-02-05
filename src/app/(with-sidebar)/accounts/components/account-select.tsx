'use client';

import Image from 'next/image';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

import { AccountSelectButton } from './account-select-button';

/**
 * Render all options for selecting a virtual account.
 * Currently just USD and EUR, with AED coming soon.
 */
export const AccountSelect = ({
  className,
  selected,
  onSelect,
  enabledAccounts,
}: {
  className?: string;
  selected: 'usd' | 'eur';
  onSelect: (id: 'usd' | 'eur') => void;
  enabledAccounts: ('usd' | 'eur')[];
}) => {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <AccountSelectButton
        id='usd'
        selected={selected === 'usd'}
        onSelect={() => onSelect('usd')}
        isLocked={!enabledAccounts.includes('usd')}
      />
      <AccountSelectButton
        id='eur'
        selected={selected === 'eur'}
        onSelect={() => onSelect('eur')}
        isLocked={!enabledAccounts.includes('eur')}
      />
      {/* AED Coming Soon Card */}
      <div className='flex h-fit items-center gap-1.5 rounded-md border p-6 text-sm'>
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
        <Badge className='text-foreground bg-[#E4E4E7] hover:bg-[#E4E4E7]'>
          Coming Soon
        </Badge>
      </div>
    </div>
  );
};
