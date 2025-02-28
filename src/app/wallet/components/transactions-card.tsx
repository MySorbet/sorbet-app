import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { TransactionTable } from './transaction-table';
import { TableTransaction } from './transaction-table';
import { TransactionTableCard } from './transaction-table-card';
import { openTransactionInExplorer } from './utils';

// TODO: Note that the bottom padding on this component is a little too much. This is b/c TransactionTable is adding some
// TODO: Note this is a duplicate of the TransactionCard component in the dashboard page. Could they share?

/** Render a transaction table and some header information within a card */
export const TransactionsCard = ({
  transactions,
  isLoading,
  description,
}: {
  transactions: TableTransaction[];
  isLoading?: boolean;
  description?: string;
}) => {
  return (
    <TransactionTableCard className='@container'>
      <CardHeader className='p-0 pb-6'>
        <div className='flex items-center justify-between'>
          <CardTitle>Transactions</CardTitle>
          <Button variant='secondary' asChild>
            <Link href='/wallet/all' aria-label='View all transactions'>
              <span className='@xs:inline hidden'>View all</span>
              <ArrowUpRight />
            </Link>
          </Button>
        </div>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <TransactionTable
        isLoading={isLoading}
        transactions={transactions}
        onTransactionClick={openTransactionInExplorer}
      />
    </TransactionTableCard>
  );
};
