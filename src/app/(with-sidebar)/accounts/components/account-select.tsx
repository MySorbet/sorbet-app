'use client';

import { cn } from '@/lib/utils';

import {
  AccountSelectButton,
  type AccountId,
  type AccountState,
} from './account-select-button';

interface AccountInfo {
  id: AccountId;
  state: AccountState;
}

interface AccountSelectProps {
  className?: string;
  selected: AccountId;
  onSelect: (id: AccountId) => void;
  accounts: AccountInfo[];
  onClaim?: (id: AccountId) => void;
  claimingAccount?: AccountId | null;
}

/**
 * Render all options for selecting a virtual account.
 * Supports USD, EUR, AED, GBP, SAR with various states.
 */
export const AccountSelect = ({
  className,
  selected,
  onSelect,
  accounts,
  onClaim,
  claimingAccount,
}: AccountSelectProps) => {
  // Helper to get account state
  const getAccountInfo = (id: AccountId): AccountInfo => {
    return accounts.find((a) => a.id === id) ?? { id, state: 'locked' };
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {/* USD Account */}
      <AccountSelectButton
        id='usd'
        selected={selected === 'usd'}
        onSelect={() => onSelect('usd')}
        state={getAccountInfo('usd').state}
        onClaim={() => onClaim?.('usd')}
        isClaiming={claimingAccount === 'usd'}
      />

      {/* EUR Account */}
      <AccountSelectButton
        id='eur'
        selected={selected === 'eur'}
        onSelect={() => onSelect('eur')}
        state={getAccountInfo('eur').state}
        onClaim={() => onClaim?.('eur')}
        isClaiming={claimingAccount === 'eur'}
      />

      {/* AED Account */}
      <AccountSelectButton
        id='aed'
        selected={selected === 'aed'}
        onSelect={() => onSelect('aed')}
        state={getAccountInfo('aed').state}
        onClaim={() => onClaim?.('aed')}
        isClaiming={claimingAccount === 'aed'}
      />

      {/* GBP Account - Always Coming Soon */}
      <AccountSelectButton
        id='gbp'
        selected={false}
        onSelect={() => undefined}
        state='coming-soon'
      />

      {/* SAR Account - Always Coming Soon */}
      <AccountSelectButton
        id='sar'
        selected={false}
        onSelect={() => undefined}
        state='coming-soon'
      />
    </div>
  );
};
