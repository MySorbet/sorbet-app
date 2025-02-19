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
      <SquareUser className='size-8' />

      <div>
        <p className='text-sm font-semibold'>{client.name}</p>
        <p className='text-xs'>{client.email}</p>
      </div>

      <Button variant='ghost' size='icon' onClick={onEdit}>
        <FilePenLine className='size-6' />
      </Button>

      <Button variant='ghost' size='icon' onClick={onDelete}>
        <X className='size-6' />
      </Button>
    </div>
  );
};
