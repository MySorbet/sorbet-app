import { ArrowUpRight, HandCoins } from 'lucide-react';
import Link from 'next/link';

import { TransactionTable } from '@/app/(with-sidebar)/wallet/components/transaction-table';
import {
  mapTransactionOverview,
  openTransactionInExplorer,
} from '@/app/(with-sidebar)/wallet/components/utils';
import { useTransactionOverview } from '@/app/(with-sidebar)/wallet/hooks/use-transaction-overview';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useSmartWalletAddress } from '@/hooks/web3/use-smart-wallet-address';

import { DashboardCard } from './dashboard-card';

// TODO: Note this is a duplicate of the TransactionsCard component in the wallet page. Could they share?

/**
 * Render the transaction table with some additional UI as a dashboard card
 * Note: Fetches its own data
 */
export const TransactionCard = () => {
  // No need to limit number of transaction because the API defaults to a limit of 5 anyway
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
    <DashboardCard className='animate-in fade-in slide-in-from-bottom-1 @container'>
      <div className='mb-6 flex flex-wrap justify-between gap-3'>
        <div>
          <h2 className='mb-1 text-2xl font-semibold'>Transactions</h2>
          <span className='text-muted-foreground text-sm'>
            Recent transactions
          </span>
        </div>
        <Button variant='secondary' asChild>
          <Link href='/wallet/all' aria-label='View all transactions'>
            <span className='@xs:inline hidden'>View all</span>
            <ArrowUpRight />
          </Link>
        </Button>
      </div>
      <TransactionTable
        transactions={mappedTransactions}
        isLoading={isLoading}
        onTransactionClick={openTransactionInExplorer}
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
