import { ArrowUpRight, HandCoins } from 'lucide-react';
import Link from 'next/link';

import { DashboardCard } from '@/app/dashboard/components/dashboard-card';
import { TransactionTable } from '@/app/wallet/components/transaction-table';
import { mapTransactionOverview } from '@/app/wallet/components/utils';
import { useTransactionOverview } from '@/app/wallet/hooks/use-transaction-overview';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useSmartWalletAddress } from '@/hooks/web3/use-smart-wallet-address';

export const TransactionCard = () => {
  const { data: overview, isLoading } = useTransactionOverview();
  const { smartWalletAddress } = useSmartWalletAddress();
  const mappedTransactions =
    smartWalletAddress && overview
      ? mapTransactionOverview(overview.transactions, smartWalletAddress)
      : [];

  // If there are no transactions and not loading, render an empty
  // Note that <TransactionTable /> is capable of rendering an empty state
  // but we override it here to provide a newer design
  if (mappedTransactions.length === 0 && !isLoading) {
    return <EmptyTransactionCard />;
  }

  return (
    <DashboardCard className='animate-in fade-in slide-in-from-bottom-1'>
      <div className='mb-6 flex flex-wrap justify-between gap-3'>
        <div>
          <h2 className='mb-1 text-2xl font-semibold'>Transactions</h2>
          <span className='text-muted-foreground text-sm'>
            Recent transactions
          </span>
        </div>
        <Button variant='secondary' asChild>
          <Link href='/wallet/all'>
            View all
            <ArrowUpRight className='ml-2 size-4' />
          </Link>
        </Button>
      </div>
      <TransactionTable
        transactions={mappedTransactions}
        isLoading={isLoading}
      />
    </DashboardCard>
  );
};

/** Local component to render an empty state for the transaction card */
const EmptyTransactionCard = () => {
  return (
    <Card className='animate-in fade-in slide-in-from-bottom-1 min-w-fit border-dashed p-6 shadow-none'>
      <div className='flex flex-col items-center justify-center py-12 text-center'>
        <div className='bg-background border-border mb-6 rounded-md border p-3 shadow-sm'>
          <HandCoins className='size-6' />
        </div>
        <h3 className='mb-2 text-xl font-semibold'>No transactions yet</h3>
        <p className='text-muted-foreground text-sm'>
          Your transactions will be displayed here once you create your first
          one
        </p>
      </div>
    </Card>
  );
};
