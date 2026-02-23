'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

import { CopyButton } from '@/components/common/copy-button/copy-button';
import { TextMorph } from '@/components/motion-primitives/text-morph';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/currency';
import { formatWalletAddress } from '@/lib/utils';

/** Small horizontal stat card with action button */
export const SmallStatCard = ({
  title,
  value,
  description,
  buttonLabel,
  isLoading,
  onClick,
  formatValue = true,
  infoButtonUrl,
  walletAddress,
  actions,
}: {
  /** Card title */
  title: string;
  /** Stat value (number or string) */
  value?: number | string;
  /** Description text below value */
  description: string;
  /** Button label text */
  buttonLabel: string;
  /** Whether the data is loading */
  isLoading?: boolean;
  /** Button click handler */
  onClick?: () => void;
  /** Whether to format value as currency */
  formatValue?: boolean;
  /** Optional URL for info button that links to documentation */
  infoButtonUrl?: string;
  /** Optional wallet address to display with copy functionality */
  walletAddress?: string;
  /** Optional custom actions area (replaces Info + button) */
  actions?: ReactNode;
}) => {
  const displayValue =
    typeof value === 'number' && formatValue
      ? formatCurrency(value)
      : String(value ?? 0);

  return (
    <Card className='flex min-h-[138px] flex-col justify-between p-4 sm:p-6'>
      <div className='flex min-h-[52px] flex-wrap items-start justify-between gap-2'>
        <div className='flex min-w-0 flex-col'>
          <h3 className='truncate text-sm font-medium'>{title}</h3>
          {walletAddress && (
            <div className='mt-0.5 flex items-center gap-2'>
              <p className='text-muted-foreground font-mono text-xs'>
                {formatWalletAddress(walletAddress)}
              </p>
              <CopyButton
                stringToCopy={walletAddress}
                variant='ghost'
                size='icon'
                className='h-5 w-5'
                copyIconClassName='text-muted-foreground size-3'
                checkIconClassName='text-green-600 size-3'
              />
            </div>
          )}
        </div>
        <div className='flex items-center gap-2'>
          {actions ? (
            actions
          ) : (
            <>
              {infoButtonUrl && (
                <Button variant='outline' size='sm' asChild>
                  <Link
                    href={infoButtonUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    Info
                  </Link>
                </Button>
              )}
              <Button variant='outline' size='sm' onClick={onClick}>
                {buttonLabel}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className='mt-auto space-y-1'>
        {isLoading ? (
          <Skeleton className='h-8 w-24' />
        ) : (
          <p className='truncate text-xl font-bold sm:text-2xl'>
            {formatValue && typeof value === 'number' ? (
              <TextMorph>{displayValue}</TextMorph>
            ) : (
              displayValue
            )}
          </p>
        )}
        <p className='text-muted-foreground text-xs'>{description}</p>
      </div>
    </Card>
  );
};
