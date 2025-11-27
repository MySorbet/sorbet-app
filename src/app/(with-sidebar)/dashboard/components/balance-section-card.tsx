'use client';

import { InfoTooltip } from '@/components/common/info-tooltip/info-tooltip';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/currency';

import {
  BalanceChart,
  type BalanceHistory,
} from '../../wallet/components/balance-card/balance-chart';
import {
  Duration,
  SelectDuration,
  displayDuration,
} from '../../wallet/components/balance-card/select-duration';
import { WalletSummaryCard } from '../../wallet/components/wallet-summary-card';

/** Large card containing balance chart and money in/out summary */
export const BalanceSectionCard = ({
  history,
  moneyIn,
  moneyOut,
  balance,
  duration,
  onDurationChange,
  isLoading,
}: {
  /** Balance history data */
  history: BalanceHistory;
  /** Total money in */
  moneyIn: number;
  /** Total money out */
  moneyOut: number;
  /** Current balance */
  balance: number;
  /** Duration window for the chart and summaries */
  duration: Duration;
  /** Handler to change the duration window */
  onDurationChange: (value: Duration) => void;
  /** Whether the data is loading */
  isLoading?: boolean;
}) => {
  return (
    <Card className='p-4 sm:p-6'>
      <CardHeader className='p-0 pb-4'>
        <div className='flex items-start justify-between gap-3'>
          <div>
            <CardDescription className='flex items-center gap-1 text-xs sm:text-sm'>
              Balance
              <InfoTooltip>
                Your non-custodial Sorbet Wallet balance in USDC
              </InfoTooltip>
            </CardDescription>
            {isLoading ? (
              <Skeleton className='mt-1 h-7 w-24 sm:h-8 sm:w-28' />
            ) : (
              <p className='mt-1 text-2xl font-semibold sm:text-3xl'>
                {formatCurrency(balance)}
              </p>
            )}
          </div>
          <SelectDuration
            selectedValue={duration}
            onChange={onDurationChange}
            disabled={isLoading}
          />
        </div>
      </CardHeader>
      <CardContent className='space-y-4 p-0 sm:space-y-6'>
        {/* Balance Chart */}
        <div className='h-[180px] sm:h-[235px]'>
          {isLoading ? (
            <Skeleton className='h-full w-full' />
          ) : (
            <BalanceChart history={history} />
          )}
        </div>

        {/* Money In/Out Cards */}
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6'>
          <WalletSummaryCard
            label='Money in'
            value={moneyIn}
            subscript={displayDuration[duration]}
            isLoading={isLoading}
          />
          <WalletSummaryCard
            label='Money out'
            value={moneyOut}
            subscript={displayDuration[duration]}
            isLoading={isLoading}
          />
        </div>
      </CardContent>
    </Card>
  );
};
