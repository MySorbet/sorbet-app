'use client';

import { cn } from '@/lib/utils';

import { AccountSelectButton } from './account-select-button';

/**
 * Render all options for selecting a virtual account.
 * Currently just USD and EUR.
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
    </div>
  );
};
