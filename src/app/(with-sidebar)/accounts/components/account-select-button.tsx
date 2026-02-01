'use client';

import { Check, Lock } from 'lucide-react';
import Image from 'next/image';
import { CircleFlag } from 'react-circle-flags';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/common/spinner';
import { cn } from '@/lib/utils';

export type AccountId = 'usd' | 'eur' | 'aed' | 'gbp' | 'sar';

export type AccountState =
  | 'available' // Has virtual account, show details
  | 'claimable' // Verified but needs to claim (show Claim button)
  | 'locked' // Not verified yet (show lock icon)
  | 'coming-soon'; // Not available yet (show Coming Soon badge)

interface AccountSelectButtonProps {
  id: AccountId;
  selected: boolean;
  onSelect: () => void;
  state: AccountState;
  onClaim?: () => void;
  isClaiming?: boolean;
}

// Country code mapping for CircleFlag
const COUNTRY_CODES: Record<AccountId, string> = {
  usd: 'us',
  eur: 'eu',
  aed: 'ae',
  gbp: 'gb',
  sar: 'sa',
};

// Display labels
const ACCOUNT_LABELS: Record<AccountId, string> = {
  usd: 'USD',
  eur: 'EUR',
  aed: 'AED',
  gbp: 'GBP',
  sar: 'Saudi',
};

/**
 * Button representing a virtual account with various states:
 * - available: Checkmark, can view details
 * - claimable: "Claim" button to create the account
 * - locked: Lock icon, not verified yet
 * - coming-soon: "Coming Soon" badge, disabled
 */
export const AccountSelectButton = ({
  id,
  selected,
  onSelect,
  state,
  onClaim,
  isClaiming,
}: AccountSelectButtonProps) => {
  const countryCode = COUNTRY_CODES[id];
  const label = ACCOUNT_LABELS[id];
  const isDisabled = state === 'locked' || state === 'coming-soon';
  const isClickable = state === 'available' || state === 'claimable';

  const handleClick = () => {
    if (isClickable) {
      onSelect();
    }
  };

  const handleClaimClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClaim?.();
  };

  return (
    <Button
      variant='outline'
      className={cn(
        'h-fit p-6',
        selected && state === 'available' && 'border-foreground bg-muted/25',
        isDisabled && 'cursor-not-allowed opacity-60'
      )}
      onClick={handleClick}
      disabled={isDisabled}
    >
      <div className='flex w-full items-center gap-1.5'>
        {/* Use image for AED as it has a custom icon, CircleFlag for others */}
        {id === 'aed' ? (
          <Image
            src='/svg/AED-icon.svg'
            alt='AED flag'
            width={40}
            height={40}
            className='size-10'
          />
        ) : (
          <CircleFlag countryCode={countryCode} className='size-10' />
        )}

        <div className='flex-1 text-left font-semibold'>
          <span className='uppercase'>{label}</span>
          <span> account</span>
        </div>

        {/* State indicator */}
        {state === 'available' && <Check className='size-5' />}
        {state === 'locked' && <Lock className='size-5' />}
        {state === 'coming-soon' && (
          <Badge className='bg-[#E4E4E7] text-foreground hover:bg-[#E4E4E7]'>
            Coming Soon
          </Badge>
        )}
        {state === 'claimable' && (
          <Button
            variant='outline'
            size='sm'
            className='ml-2 h-8'
            onClick={handleClaimClick}
            disabled={isClaiming}
          >
            {isClaiming ? <Spinner className='size-4' /> : 'Claim'}
          </Button>
        )}
      </div>
    </Button>
  );
};
