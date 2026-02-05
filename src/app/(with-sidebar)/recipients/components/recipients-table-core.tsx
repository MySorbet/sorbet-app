'use client';

import {
  DollarSign,
  EllipsisVertical,
  Euro,
  Plus,
  Send,
  Trash,
  Users,
  Wallet,
} from 'lucide-react';
import { useState } from 'react';

import { RecipientAPI, RecipientType } from '@/api/recipients/types';
import { formatDate } from '@/app/invoices/utils';
import { CopyButton } from '@/components/common/copy-button/copy-button';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { formatWalletAddress } from '@/lib/utils';

import { formatAccountNumber } from './utils';

interface RecipientsTableCoreProps {
  recipients: RecipientAPI[];
  isLoading?: boolean;
  onRowClick?: (recipientId: string) => void;
  onDelete?: (recipientId: string) => void;
  onSend?: (recipientId: string) => void;
  onAdd?: () => void;
}

/**
 * Renders a table of recipients using native HTML table structure.
 * Scrolls horizontally when its container is too narrow for a row.
 * Renders a simple empty state if not loading and no recipients are present.
 */
export const RecipientsTableCore: React.FC<RecipientsTableCoreProps> = ({
  recipients,
  isLoading = false,
  onRowClick,
  onDelete,
  onSend,
  onAdd,
}) => {
  // Manage open state of dropdowns
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const handleMenuOpen = (recipientId: string, isOpen: boolean) => {
    setOpenMenus((prev) => ({ ...prev, [recipientId]: isOpen }));
  };

  // Show empty state if no recipients and not loading
  if (!isLoading && recipients.length === 0) {
    return <EmptyState onAdd={onAdd} />;
  }

  return (
    <div className='overflow-x-auto'>
      <table className='w-full min-w-[640px] divide-y divide-gray-200'>
        <thead className='border-b'>
          <tr>
            <th
              scope='col'
              className='w-[25%] py-3 text-left text-xs font-medium text-gray-500'
            >
              Name
            </th>
            <th
              scope='col'
              className='w-[20%] py-3 text-left text-xs font-medium text-gray-500'
            >
              Date created
            </th>
            <th
              scope='col'
              className='w-[15%] py-3 text-left text-xs font-medium text-gray-500'
            >
              Currency Type
            </th>
            <th
              scope='col'
              className='w-[30%] py-3 text-right text-xs font-medium text-gray-500'
            >
              Account
            </th>
            <th
              scope='col'
              className='w-[10%] py-3 text-right text-xs font-medium text-gray-500'
            >
              <span className='sr-only'>Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className='bg-background'>
          {isLoading ? (
            <TableSkeleton />
          ) : (
            recipients.map((recipient) => (
              <tr
                key={recipient.id}
                onClick={() => onRowClick?.(recipient.id)}
                className='animate-in fade-in cursor-pointer hover:bg-muted/50'
              >
                <td className='whitespace-nowrap py-4'>
                  <div className='text-sm font-medium'>{recipient.label}</div>
                </td>
                <td className='whitespace-nowrap py-4'>
                  <div className='text-sm'>{formatDate(recipient.createdAt)}</div>
                </td>
                <td className='whitespace-nowrap py-4'>
                  <RecipientTypeCell type={recipient.type} />
                </td>
                <td className='whitespace-nowrap py-4 text-right'>
                  <AccountDetail recipient={recipient} />
                </td>
                <td className='whitespace-nowrap py-4 text-right'>
                  <DropdownMenu
                    open={openMenus[recipient.id]}
                    onOpenChange={(isOpen) =>
                      handleMenuOpen(recipient.id, isOpen)
                    }
                  >
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='size-6'
                        onClick={(e) => e.stopPropagation()}
                      >
                        <EllipsisVertical className='size-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side='top'>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          onSend?.(recipient.id);
                          handleMenuOpen(recipient.id, false);
                        }}
                      >
                        <Send className='size-4' />
                        Send Funds
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className='text-destructive'
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete?.(recipient.id);
                        }}
                        disabled={
                          recipient.type !== 'crypto_base' &&
                          recipient.type !== 'crypto_stellar'
                        }
                      >
                        <Trash className='size-4' />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

/** Displays the recipient type with icon */
const RecipientTypeCell = ({ type }: { type: RecipientType }) => {
  const Icon = type === 'usd' ? DollarSign : type === 'eur' ? Euro : Wallet;
  const label = type === 'usd' ? 'USD' : type === 'eur' ? 'EUR' : 'Crypto';

  return (
    <div className='flex items-center gap-2'>
      <Icon className='size-5' strokeWidth={1.5} />
      <span className='text-sm'>{label}</span>
    </div>
  );
};

/** Displays account detail - wallet address or masked account number */
const AccountDetail = ({ recipient }: { recipient: RecipientAPI }) => {
  if (recipient.type === 'crypto_base' || recipient.type === 'crypto_stellar') {
    return (
      <CopyButton
        className='h-fit flex-row-reverse p-1 px-0 text-sm font-normal'
        stringToCopy={recipient.detail}
        variant='link'
        copyIconClassName='text-muted-foreground'
        onClick={(e) => e.stopPropagation()}
      >
        {formatWalletAddress(recipient.detail)}
      </CopyButton>
    );
  }
  return <span className='text-sm'>{formatAccountNumber(recipient.detail)}</span>;
};

/** Empty state when no recipients exist */
const EmptyState = ({ onAdd }: { onAdd?: () => void }) => {
  return (
    <div className='flex flex-col items-center justify-center gap-6 py-16'>
      <Users className='size-10 stroke-[1.5] text-muted-foreground' />
      <p className='text-muted-foreground text-sm'>
        Add recipients for faster and safer transfers
      </p>
      <Button variant='sorbet' onClick={onAdd}>
        <Plus className='size-4' />
        Add recipient
      </Button>
    </div>
  );
};

/** Skeleton loader for table rows */
const TableSkeleton = () => {
  return (
    <>
      {[...Array(4)].map((_, index) => (
        <tr key={index}>
          <td className='whitespace-nowrap py-4'>
            <Skeleton className='h-5 w-28' />
          </td>
          <td className='whitespace-nowrap py-4'>
            <Skeleton className='h-5 w-24' />
          </td>
          <td className='whitespace-nowrap py-4'>
            <div className='flex items-center gap-2'>
              <Skeleton className='size-5 rounded-full' />
              <Skeleton className='h-5 w-16' />
            </div>
          </td>
          <td className='whitespace-nowrap py-4 text-right'>
            <Skeleton className='ml-auto h-5 w-28' />
          </td>
          <td className='whitespace-nowrap py-4 text-right'>
            <Skeleton className='ml-auto size-6' />
          </td>
        </tr>
      ))}
    </>
  );
};
