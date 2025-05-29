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
import { useQueryState } from 'nuqs';
import { useState } from 'react';

import { RecipientAPI, RecipientType } from '@/api/recipients/types';
import { formatDate } from '@/app/invoices/utils';
import { CopyText } from '@/components/common/copy-text';
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

/** Displays a list of recipients and a button to add a new recipient */
export const RecipientsCard = ({
  onAdd,
  recipients,
  loading,
  onClick,
}: {
  onAdd?: () => void;
  recipients?: RecipientAPI[];
  loading?: boolean;
  onClick?: (recipientId: string) => void;
}) => {
  return (
    <Card className='w-full max-w-7xl overflow-clip'>
      {recipients && (recipients?.length !== 0 || loading) ? (
        <RecipientsTable
          recipients={recipients}
          onClick={onClick}
          loading={loading}
        />
      ) : (
        <EmptyState onAdd={onAdd} />
      )}
    </Card>
  );
};

const RecipientsTable = ({
  recipients,
  onClick,
  loading,
}: {
  recipients: RecipientAPI[];
  onClick?: (recipientId: string) => void;
  loading?: boolean;
}) => {
  const [, setSendTo] = useQueryState('send-to');
  const [actionsOpen, setActionsOpen] = useState(false);

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
                <DropdownMenu open={actionsOpen} onOpenChange={setActionsOpen}>
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
                    <DropdownMenuItem disabled className='text-destructive'>
                      <Trash />
                      Delete
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        setSendTo(recipient.id);
                        setActionsOpen(false);
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
  if (recipient.type === 'crypto') {
    const formattedAddress = formatWalletAddress(recipient.detail);
    return <CopyText text={formattedAddress} textToCopy={recipient.detail} />;
  }
  return <CopyText text={recipient.detail} />;
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
    <div className='flex flex-col items-center justify-center gap-4 p-4 py-8'>
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
