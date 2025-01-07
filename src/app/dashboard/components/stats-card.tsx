import { ArrowRight, DollarSign, View, Wallet } from 'lucide-react';

import { DashboardCard } from './dashboard-card';

export type StatsCardType = 'wallet' | 'invoice' | 'profile';

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
  onClick,
}: {
  title: string;
  type: StatsCardType;
  value: string;
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
        <p className='text-2xl font-bold'>{value}</p>
        <p className='text-muted-foreground text-xs'>{description}</p>
      </div>
    </DashboardCard>
  );
};
