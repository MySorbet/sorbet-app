'use client';

import { FilePenLine, SquareUser, X } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { Client } from '../schema';

/** Render a clients name, email with edit and delete buttons */
export const SelectedClient = ({
  client,
  onEdit,
  onDelete,
}: {
  client: Client;
  onEdit?: () => void;
  onDelete?: () => void;
}) => {
  return (
    <div className='flex items-center gap-2 p-2'>
      <SquareUser className='size-8' strokeWidth={1.5} />

      <div className='mr-4'>
        <p className='text-sm font-semibold leading-none'>{client.name}</p>
        <p className='text-xs leading-none'>{client.email}</p>
      </div>

      <Button
        variant='ghost'
        size='icon'
        className='text-muted-foreground size-6 p-1.5'
        onClick={onEdit}
      >
        <FilePenLine className='size-6' />
      </Button>

      <Button
        variant='ghost'
        size='icon'
        className='text-muted-foreground size-6 p-1.5'
        onClick={onDelete}
      >
        <X className='size-6' />
      </Button>
    </div>
  );
};
