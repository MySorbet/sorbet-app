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
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatWalletAddress } from '@/lib/utils';

import { useSendTo } from '../hooks/use-send-to';
import { formatAccountNumber } from './utils';

/** Displays a table of recipients with actions */
export const RecipientsTable = ({
  onAdd,
  onDelete,
  recipients,
  loading,
  onClick,
}: {
  onAdd?: () => void;
  onDelete?: (recipientId: string) => void;
  recipients?: RecipientAPI[];
  loading?: boolean;
  onClick?: (recipientId: string) => void;
}) => {
  return (
    <Card className='h-fit w-full max-w-7xl overflow-clip'>
      {recipients && (recipients?.length !== 0 || loading) ? (
        <RecipientsTableInternal
          recipients={recipients}
          onClick={onClick}
          loading={loading}
          onDelete={onDelete}
        />
      ) : (
        <EmptyState onAdd={onAdd} />
      )}
    </Card>
  );
};

const RecipientsTableInternal = ({
  recipients,
  onClick,
  loading,
  onDelete,
}: {
  recipients: RecipientAPI[];
  onClick?: (recipientId: string) => void;
  loading?: boolean;
  onDelete?: (recipientId: string) => void;
}) => {
  const { set } = useSendTo();

  // Manage open state of dropdowns as a list. TODO: Better this way or each row with state?
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const handleMenuOpen = (recipientId: string, isOpen: boolean) => {
    setOpenMenus((prev) => ({ ...prev, [recipientId]: isOpen }));
  };

  return (
    <Table>
      <TableHeader className='bg-muted'>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Date created</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className='text-right'>Account</TableHead>
          <TableHead className='sr-only'>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <RecipientsTableRows length={4} />
        ) : (
          recipients.map((recipient) => (
            <TableRow
              key={recipient.id}
              onClick={() => onClick?.(recipient.id)}
              className='cursor-pointer'
            >
              <TableCell className='font-medium'>{recipient.label}</TableCell>
              <TableCell>{formatDate(recipient.createdAt)}</TableCell>
              <TableCell>
                <Type type={recipient.type} />
              </TableCell>
              <TableCell className='text-right'>
                <TableDetail recipient={recipient} />
              </TableCell>
              <TableCell className='text-right'>
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
                      <EllipsisVertical />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side='top'>
                    <DropdownMenuItem
                      className='text-destructive'
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete?.(recipient.id);
                        // TODO: Loading state / disable during delete? Or optimistic?
                      }}
                    disabled={
                      recipient.type !== 'crypto_base' &&
                      recipient.type !== 'crypto_stellar'
                    }
                    >
                      <Trash />
                      Delete
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        set({ recipientId: recipient.id });
                        handleMenuOpen(recipient.id, false);
                      }}
                    >
                      <Send />
                      Send
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

const TableDetail = ({ recipient }: { recipient: RecipientAPI }) => {
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
  return formatAccountNumber(recipient.detail);
};

const Type = ({ type }: { type: RecipientType }) => {
  const Icon = type === 'usd' ? DollarSign : type === 'eur' ? Euro : Wallet;
  const label = type === 'usd' ? 'USD' : type === 'eur' ? 'EUR' : 'Crypto';
  return (
    <div className='flex flex-row items-center gap-1 text-sm'>
      <Icon className='size-6' strokeWidth={1} />
      {label}
    </div>
  );
};

const EmptyState = ({ onAdd }: { onAdd?: () => void }) => {
  return (
    <div className='flex flex-col items-center justify-center gap-6 p-4 py-8'>
      <Users className='size-10 stroke-[1.5]' />
      <p className='text-sm'>Add recipients for faster and safer transfers</p>
      <Button variant='sorbet' onClick={onAdd}>
        <Plus />
        Add recipient
      </Button>
    </div>
  );
};

const RecipientsTableRows = ({ length }: { length: number }) => {
  return (
    <>
      {Array.from({ length }).map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <Skeleton className='h-6 w-24' />
          </TableCell>
          <TableCell>
            <Skeleton className='h-6 w-24' />
          </TableCell>
          <TableCell>
            <Skeleton className='h-6 w-24' />
          </TableCell>
          <TableCell>
            <Skeleton className='ml-auto h-6 w-24' />
          </TableCell>
          <TableCell>
            <Skeleton className='ml-auto size-6' />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};
