import { DollarSign, View, Wallet } from 'lucide-react';

import { DashboardCard } from './dashboard-card';

type StatsCardType = 'wallet' | 'invoice' | 'profile';

const IconMap: Record<StatsCardType, React.ElementType> = {
  wallet: Wallet,
  invoice: DollarSign,
  profile: View,
};

export const StatsCard = ({
  title,
  type,
  value,
  description,
}: {
  title: string;
  type: StatsCardType;
  value: string;
  description: string;
}) => {
  const Icon = IconMap[type];
  return (
    <DashboardCard className='flex w-full max-w-sm flex-col gap-2'>
      <div className='flex items-center justify-between gap-2'>
        <h2 className='text-sm font-medium'>{title}</h2>
        <Icon className='size-4' />
      </div>
      <div className='flex flex-col'>
        <p className='text-2xl font-bold'>{value}</p>
        <p className='text-muted-foreground text-xs'>{description}</p>
      </div>
    </DashboardCard>
  );
};
