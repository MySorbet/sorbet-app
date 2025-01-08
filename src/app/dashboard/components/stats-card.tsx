import { ArrowRight, DollarSign, View, Wallet } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/currency';

import { DashboardCard } from './dashboard-card';

export type StatsCardType = 'wallet' | 'invoice' | 'profile';

const IconMap: Record<StatsCardType, React.ElementType> = {
  wallet: Wallet,
  invoice: DollarSign,
  profile: View,
};

// TODO: Revisit enter an exit animations for skeleton and value
/**
 * Displays a stat card with a title, value, and description.
 * value is formatted based on the type.
 */
export const StatsCard = ({
  title,
  type,
  value,
  description,
  onClick,
}: {
  title: string;
  type: StatsCardType;
  value?: number;
  description: string;
  onClick?: () => void;
}) => {
  const Icon = IconMap[type];
  return (
    <DashboardCard
      className='group flex h-fit w-full max-w-lg cursor-pointer flex-col gap-2'
      onClick={onClick}
    >
      <div className='flex items-center justify-between gap-2'>
        <div className='flex items-center'>
          <h2 className='text-sm font-medium'>{title}</h2>
          <ArrowRight className='animate-in fade-in-0 zoom-in-0 aria-hidden size-4 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100' />
        </div>
        <Icon className='size-4' />
      </div>
      <div className='flex flex-col'>
        {value === undefined ? (
          <Skeleton className='mb-1 h-7 w-20' />
        ) : (
          <p className='text-2xl font-bold'>{formatValue(value, type)}</p>
        )}
        <p className='text-muted-foreground text-xs'>{description}</p>
      </div>
    </DashboardCard>
  );
};

const formatValue = (value: number, type: StatsCardType) => {
  if (type === 'wallet' || type === 'invoice') {
    return formatCurrency(value);
  }

  // Profile views are integers
  return value.toString();
};
