'use client';

import { useState } from 'react';

import { cn } from '@/lib/utils';

import { AccountSelectButton } from './account-select-button';

/**
 * Render all options for selecting a virtual account.
 * Currently just USD and EUR.
 */
export const AccountSelect = ({ className }: { className?: string }) => {
  const [selected, setSelected] = useState('usd');

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <AccountSelectButton
        id='usd'
        selected={selected === 'usd'}
        onSelect={() => setSelected('usd')}
      />
      <AccountSelectButton
        id='eur'
        selected={selected === 'eur'}
        onSelect={() => setSelected('eur')}
      />
    </div>
  );
};
