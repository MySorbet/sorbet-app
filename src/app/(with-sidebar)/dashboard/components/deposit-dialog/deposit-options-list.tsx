'use client';

import { ChevronRight, Euro, Wallet } from 'lucide-react';
import { DollarSign } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import type { DepositOption } from './deposit-dialog';

interface DepositOptionsListProps {
  onSelect: (option: DepositOption) => void;
  onClose: () => void;
  hasUSDAccount: boolean;
  hasEURAccount: boolean;
}

/**
 * Selection screen showing three deposit options: USDC Wallet, USD Account, EUR Account
 */
export const DepositOptionsList = ({
  onSelect,
  onClose,
  hasUSDAccount,
  hasEURAccount,
}: DepositOptionsListProps) => {
  const [hoveredOption, setHoveredOption] = useState<DepositOption | null>(
    null
  );

  const handleSelect = (option: DepositOption) => {
    onSelect(option);
  };

  return (
    <div className='flex flex-col gap-4 p-6'>
      {/* Header */}
      <h2 className='text-xl font-semibold text-[#101828]'>Sorbet Deposit</h2>

      {/* Options */}
      <div className='flex flex-col gap-3'>
        <DepositOptionCard
          icon={<Wallet className='size-5' />}
          label='USDC Wallet'
          onClick={() => handleSelect('usdc')}
          disabled={false}
          isHovered={hoveredOption === 'usdc'}
          onHover={(hovered) => setHoveredOption(hovered ? 'usdc' : null)}
        />
        <DepositOptionCard
          icon={<DollarSign className='size-5' />}
          label='USD Account'
          onClick={() => handleSelect('usd')}
          disabled={!hasUSDAccount}
          isHovered={hoveredOption === 'usd'}
          onHover={(hovered) => setHoveredOption(hovered ? 'usd' : null)}
        />
        <DepositOptionCard
          icon={<Euro className='size-5' />}
          label='EUR Account'
          onClick={() => handleSelect('eur')}
          disabled={!hasEURAccount}
          isHovered={hoveredOption === 'eur'}
          onHover={(hovered) => setHoveredOption(hovered ? 'eur' : null)}
        />
      </div>

      {/* Close button */}
      <Button variant='outline' onClick={onClose} className='mt-2 w-full'>
        Close
      </Button>
    </div>
  );
};

interface DepositOptionCardProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled: boolean;
  isHovered: boolean;
  onHover: (hovered: boolean) => void;
}

/**
 * Individual option card with icon, label, and chevron
 * Shows selected state with purple border/background and purple icon circle on hover/active
 */
const DepositOptionCard = ({
  icon,
  label,
  onClick,
  disabled,
  isHovered,
  onHover,
}: DepositOptionCardProps) => {
  const isActive = isHovered && !disabled;

  return (
    <button
      type='button'
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onFocus={() => onHover(true)}
      onBlur={() => onHover(false)}
      className={cn(
        'flex w-full items-center gap-3 rounded-xl border p-4 transition-all',
        'focus:ring-sorbet focus:outline-none focus:ring-2 focus:ring-offset-2',
        isActive ? 'border-sorbet bg-sorbet/5' : 'border-[#E4E4E7] bg-white',
        disabled && 'cursor-not-allowed opacity-50'
      )}
    >
      {/* Icon container - becomes purple with white icon on hover/active */}
      <div
        className={cn(
          'flex size-10 items-center justify-center rounded-full border transition-all',
          isActive
            ? 'border-sorbet bg-sorbet text-white'
            : 'border-[#E4E4E7] bg-white text-[#344054]'
        )}
      >
        {icon}
      </div>

      {/* Label */}
      <span className='flex-1 text-left text-sm font-medium text-[#344054]'>
        {label}
      </span>

      {/* Chevron */}
      <ChevronRight className='size-5 text-[#98A2B3]' />
    </button>
  );
};
