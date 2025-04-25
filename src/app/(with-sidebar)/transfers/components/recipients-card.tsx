import { DollarSign, Euro, Plus, Wallet } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatWalletAddress } from '@/lib/utils';

export const RecipientsCard = ({
  onAdd,
  recipients = mockRecipients,
}: {
  onAdd?: () => void;
  recipients?: Recipient[];
}) => {
  return (
    <Card className='overflow-clip'>
      <CardHeader className='bg-primary-foreground flex flex-row items-center justify-between gap-4 space-y-0 px-4'>
        <CardTitle className='text-base font-semibold'>Recipients</CardTitle>
        <Button variant='outline' size='sm' onClick={onAdd}>
          <Plus />
          Add new
        </Button>
      </CardHeader>
      <CardContent className='p-3'>
        {recipients && recipients.length !== 0 ? (
          <RecipientsTable recipients={recipients} />
        ) : (
          <EmptyState />
        )}
      </CardContent>
    </Card>
  );
};

const RecipientsTable = ({ recipients }: { recipients: Recipient[] }) => {
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
            <TableCell className='font-medium'>{recipient.name}</TableCell>
            <TableCell>
              <RecipientType type={recipient.type} />
            </TableCell>
            <TableCell>
              {recipient.type === 'CRYPTO'
                ? formatWalletAddress(recipient.detail)
                : recipient.detail}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const RecipientType = ({ type }: { type: Recipient['type'] }) => {
  const Icon = type === 'USD' ? DollarSign : type === 'EUR' ? Euro : Wallet;
  return (
    <div className='flex flex-row items-center gap-1 text-sm'>
      <Icon className='size-6' strokeWidth={1} />
      {type}
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

type Recipient = {
  id: string;
  name: string;
  type: 'USD' | 'EUR' | 'CRYPTO';
  detail: string;
};

const mockRecipients: Recipient[] = [
  {
    id: '1',
    name: 'Dillon Cutaiar',
    type: 'USD',
    detail: '0123456789',
  },
  {
    id: '2',
    name: 'Dillon Cutaiar',
    type: 'EUR',
    detail: '0123456789',
  },
  {
    id: '3',
    name: 'Dillon Cutaiar',
    type: 'CRYPTO',
    detail: '0x1234567890123456789012345678901234567890',
  },
];
