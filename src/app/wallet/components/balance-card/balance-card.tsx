import { InfoTooltip } from '@/components/common/info-tooltip/info-tooltip';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/currency';

import { BalanceChart, BalanceHistory } from './balance-chart';
import { Duration, SelectDuration } from './select-duration';

/** Main card of the wallet page showing balance and history in a chart, and allowing the selection of a duration */
export const BalanceCard = ({
  balance,
  duration,
  onDurationChange,
  history,
  isLoading,
}: {
  balance: number;
  duration: Duration;
  onDurationChange: (duration: Duration) => void;
  history: BalanceHistory;
  isLoading?: boolean;
}) => {
  return (
    <Card className='h-fit min-w-80'>
      <CardHeader className='pb-2'>
        <div className='flex items-start justify-between gap-2'>
          <div className='space-y-2'>
            <CardDescription className='flex items-center gap-1'>
              Balance
              <InfoTooltip>
                Your non-custodial Sorbet Wallet balance in USDC
              </InfoTooltip>
            </CardDescription>
            {isLoading ? (
              <Skeleton className='h-8 w-24' />
            ) : (
              <CardTitle>{formatCurrency(balance)}</CardTitle>
            )}
          </div>
          <SelectDuration
            selectedValue={duration}
            onChange={onDurationChange}
            disabled={isLoading}
          />
        </div>
      </CardHeader>
      <CardContent className='px-2 pb-2'>
        {isLoading ? (
          <Skeleton className='mx-4 mb-4 h-48' />
        ) : (
          <BalanceChart history={history} />
        )}
      </CardContent>
    </Card>
  );
};
