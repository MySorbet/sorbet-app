'use client';

import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Client } from './types';

/** Card allow a client to be selected from a list, or to add a new client */
export const ClientSelector = ({
  clients,
  onClientSelect,
  onAddClient,
}: {
  clients: Client[];
  onClientSelect: (id: string) => void;
  onAddClient: () => void;
}) => {
  return (
    <Card className='bg-primary-foreground flex h-fit flex-col gap-4 p-2'>
      <Select onValueChange={onClientSelect}>
        <SelectTrigger className='w-full'>
          <SelectValue placeholder='Select a client' />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Clients</SelectLabel>
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button variant='ghost' onClick={onAddClient}>
        <Plus className='mr-2 size-4' />
        Add a new client
      </Button>
    </Card>
  );
};
