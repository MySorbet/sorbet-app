import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

import { DashboardCard } from '@/app/dashboard/components/dashboard-card';
import { TransactionTable } from '@/app/wallet/components/transaction-table';
import { mapTransactionOverview } from '@/app/wallet/components/utils';
import { useTransactionOverview } from '@/app/wallet/hooks/use-transaction-overview';
import { Button } from '@/components/ui/button';
import { useSmartWalletAddress } from '@/hooks/web3/use-smart-wallet-address';

export const TransactionCard = () => {
  const { data: overview, isLoading } = useTransactionOverview();
  const { smartWalletAddress } = useSmartWalletAddress();
  const mappedTransactions =
    smartWalletAddress && overview
      ? mapTransactionOverview(overview.transactions, smartWalletAddress)
      : [];

  // TODO: Should we limit the number of transactions displayed?
  return (
    <DashboardCard className='animate-in fade-in slide-in-from-bottom-1'>
      <div className='mb-6 flex justify-between'>
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
