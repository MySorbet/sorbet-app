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

import { Client } from '../../schema';
import { SelectedClient } from './selected-client';

/** Card allow a client to be selected from a list, or to add a new client */
export const ClientCard = ({
  clients,
  onClientSelect,
  onAddClient,
  selectedClient,
  onEditClient,
}: {
  clients: Client[];
  onClientSelect: (id?: string) => void;
  onAddClient: () => void;
  selectedClient?: Client;
  onEditClient?: (id: string) => void;
}) => {
  return (
    <Card className='bg-primary-foreground h-fit p-2'>
      {selectedClient ? (
        <SelectedClient
          client={selectedClient}
          onDelete={() => onClientSelect?.(undefined)}
          onEdit={() => onEditClient?.(selectedClient.id)}
        />
      ) : (
        <div className='flex flex-col gap-2'>
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
            Add new client
          </Button>
        </div>
      )}
    </Card>
  );
};
