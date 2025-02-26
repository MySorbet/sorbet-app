import { InfoTooltip } from '@/components/common/info-tooltip/info-tooltip';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatCurrency } from '@/lib/currency';

import { BalanceChart, BalanceHistory } from './balance-chart';
import { Duration, SelectDuration } from './select-duration';

/** Main card of the wallet page showing balance and history in a chart, and allowing the selection of a duration */
export const BalanceCard = ({
  balance,
  duration,
  onDurationChange,
  history,
}: {
  balance: number;
  duration: Duration;
  onDurationChange: (duration: Duration) => void;
  history: BalanceHistory;
}) => {
  return (
    <Card className='h-fit min-w-80'>
      <CardHeader>
        <div className='flex items-start justify-between gap-2'>
          <div className='space-y-2'>
            <CardDescription className='flex items-center gap-1'>
              Balance
              <InfoTooltip>
                Your non-custodial Sorbet Wallet balance in USDC
              </InfoTooltip>
            </CardDescription>
            <CardTitle>{formatCurrency(balance)}</CardTitle>
          </div>
          <SelectDuration
            selectedValue={duration}
            onChange={onDurationChange}
          />
        </div>
      </CardHeader>
      <CardContent>
        <BalanceChart balanceHistory={history} />
      </CardContent>
    </Card>
  );
};

// TODO: Loading skeleton
