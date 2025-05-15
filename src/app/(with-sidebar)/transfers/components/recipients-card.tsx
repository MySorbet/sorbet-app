import { DollarSign, Euro, Plus, Wallet } from 'lucide-react';

import { RecipientAPI, RecipientType } from '@/api/recipients/types';
import { CopyText } from '@/components/common/copy-text';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
}: {
  onAdd?: () => void;
  recipients?: RecipientAPI[];
  loading?: boolean;
}) => {
  return (
    <Card className='w-full max-w-lg overflow-clip'>
      <CardHeader className='bg-primary-foreground flex flex-row items-center justify-between gap-4 space-y-0 px-4'>
        <CardTitle className='text-base font-semibold'>Recipients</CardTitle>
        <Button variant='outline' size='sm' onClick={onAdd}>
          <Plus />
          Add new
        </Button>
      </CardHeader>
      <CardContent className='p-3'>
        {loading ? (
          <RecipientsTableSkeleton length={4} />
        ) : recipients && recipients?.length !== 0 ? (
          <RecipientsTable recipients={recipients} />
        ) : (
          <EmptyState />
        )}
      </CardContent>
    </Card>
  );
};

const RecipientsTable = ({ recipients }: { recipients: RecipientAPI[] }) => {
  return (
    <Table>
      <TableHeader className='sr-only'>
        <TableRow>
          <TableHead className='w-[100px]'>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Detail</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recipients.map((recipient) => (
          <TableRow key={recipient.id}>
            <TableCell className='font-medium'>{recipient.label}</TableCell>
            <TableCell>
              <Type type={recipient.type} />
            </TableCell>
            <TableCell className='text-right'>
              <TableDetail recipient={recipient} />
            </TableCell>
          </TableRow>
        ))}
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

const EmptyState = () => {
  return (
    <div className='flex flex-col items-center justify-center gap-4'>
      <p className='text-muted-foreground text-sm'>No recipients</p>
    </div>
  );
};

const RecipientsTableSkeleton = ({ length }: { length: number }) => {
  return (
    <Table>
      <TableBody>
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
