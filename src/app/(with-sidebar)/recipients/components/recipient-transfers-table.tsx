'use client';

import { ArrowUpDown, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { useState } from 'react';

import { RecipientTransfer, RecipientTransferStatus } from '@/api/recipients/types';
import {
  SimpleTransactionStatus,
  TransactionStatusBadge,
} from '@/components/common/transaction-status-badge';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/currency';

import { openTransactionInExplorer } from '@/app/(with-sidebar)/wallet/components/utils';

import { formatTransferDate } from './utils';

interface RecipientTransfersTableProps {
  transfers?: RecipientTransfer[];
  isLoading?: boolean;
}

/** Displays a collapsible table of transfers for a recipient */
export const RecipientTransfersTable = ({
  transfers = [],
  isLoading = false,
}: RecipientTransfersTableProps) => {
  const [sortAsc, setSortAsc] = useState(false);
  const [openRows, setOpenRows] = useState<Record<string, boolean>>({});

  const toggleRow = (id: string) => {
    setOpenRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Sort by date (newest first by default, toggle to oldest first)
  const sortedTransfers = [...transfers].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortAsc ? dateA - dateB : dateB - dateA;
  });

  if (isLoading) {
    return <TransfersSkeleton />;
  }

  if (transfers.length === 0) {
    return (
      <div className='rounded-lg border py-8 text-center'>
        <p className='text-muted-foreground text-sm'>No transfers yet</p>
      </div>
    );
  }

  return (
    <div className='w-full overflow-hidden rounded-lg border'>
      {/* Header */}
      <div className='flex items-center justify-between border-b bg-muted/30 px-4 py-3'>
        <Button
          variant='ghost'
          size='sm'
          className='text-muted-foreground h-auto gap-1 p-0 text-xs font-medium'
          onClick={() => setSortAsc(!sortAsc)}
        >
          Date
          <ArrowUpDown className='size-3' />
        </Button>
        <span className='text-muted-foreground text-xs font-medium'>Amount</span>
      </div>

      {/* Rows */}
      <div className='divide-y'>
        {sortedTransfers.map((transfer) => (
          <TransferRow
            key={transfer.id}
            transfer={transfer}
            isOpen={openRows[transfer.id] ?? false}
            onToggle={() => toggleRow(transfer.id)}
          />
        ))}
      </div>
    </div>
  );
};

const TransferRow = ({
  transfer,
  isOpen,
  onToggle,
}: {
  transfer: RecipientTransfer;
  isOpen: boolean;
  onToggle: () => void;
}) => {
  const handleViewTransaction = () => {
    if (transfer.txHash) {
      openTransactionInExplorer(transfer.txHash);
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <button className='flex w-full items-center justify-between px-4 py-4 text-left hover:bg-muted/50'>
          <div className='flex items-center gap-2'>
            {isOpen ? (
              <ChevronUp className='text-muted-foreground size-4' />
            ) : (
              <ChevronDown className='text-muted-foreground size-4' />
            )}
            <span className='text-sm'>{formatTransferDate(transfer.date)}</span>
          </div>
          <span className='text-sm'>{formatCurrency(transfer.amount)}</span>
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className='space-y-3 border-t px-4 pb-4 pl-10 pt-3'>
          <div className='flex items-center justify-between'>
            <span className='text-muted-foreground text-sm'>Status</span>
            <TransactionStatusBadge status={mapStatus(transfer.status)} />
          </div>
          {transfer.txHash && (
            <button
              onClick={handleViewTransaction}
              className='flex w-full items-center justify-between text-sm hover:underline'
            >
              <span>View Transaction</span>
              <ExternalLink className='text-muted-foreground size-4' />
            </button>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

/** Maps our status to the badge status */
const mapStatus = (status: RecipientTransferStatus): SimpleTransactionStatus => {
  switch (status) {
    case 'completed':
      return 'Completed';
    case 'processing':
      return 'Processing';
    case 'in_review':
      return 'In Review';
    case 'failed':
      return 'Rejected';
    case 'refunded':
      return 'Returned';
    default:
      return 'Processing';
  }
};

const TransfersSkeleton = () => (
  <div className='divide-y rounded-lg border'>
    {[...Array(3)].map((_, i) => (
      <div key={i} className='flex items-center justify-between px-4 py-4'>
        <Skeleton className='h-5 w-24' />
        <Skeleton className='h-5 w-20' />
      </div>
    ))}
  </div>
);
