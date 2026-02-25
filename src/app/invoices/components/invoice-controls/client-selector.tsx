'use client';

import { PenSquare, Plus } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { ClientAPI } from '@/api/clients/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FormField, FormItem, FormMessage } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useClients } from '../../hooks/use-clients';
import { InvoiceForm } from '../../schema';
import { AddClientDrawer } from './add-client-drawer';

export function ClientSelector() {
  const form = useFormContext<InvoiceForm>();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientAPI | null>(null);
  const [editingClient, setEditingClient] = useState<ClientAPI | null>(null);

  const { data: clients } = useClients();

  const handleSelectClient = (clientId: string) => {
    const client = clients?.find((c) => c.id === clientId);
    if (!client) return;

    setSelectedClient(client);
    form.setValue('toName', client.name);
    form.setValue('toEmail', client.email);

    if (client.street || client.city) {
      form.setValue('toAddress', {
        street: client.street || '',
        city: client.city || '',
        state: client.state || '',
        country: client.country || '',
        zip: client.zip || '',
      });
    } else {
      form.setValue('toAddress', undefined);
    }
  };

  const handleUnselect = () => {
    setSelectedClient(null);
    form.setValue('toName', '');
    form.setValue('toEmail', '');
    form.setValue('toAddress', undefined);
  };

  const handleEdit = () => {
    setEditingClient(selectedClient);
    setDrawerOpen(true);
  };

  const onDrawerSaved = (client: ClientAPI) => {
    setSelectedClient(client);
    form.setValue('toName', client.name);
    form.setValue('toEmail', client.email);

    if (client.street || client.city) {
      form.setValue('toAddress', {
        street: client.street || '',
        city: client.city || '',
        state: client.state || '',
        country: client.country || '',
        zip: client.zip || '',
      });
    } else {
      form.setValue('toAddress', undefined);
    }
  };

  return (
    <Card className='bg-primary-foreground flex h-fit flex-col gap-4 p-2'>
      {selectedClient ? (
        <div className='flex items-center justify-between gap-3 rounded-md border bg-background px-3 py-2.5'>
          <div className='flex items-center gap-3'>
            <Image
              src='/svg/clientVector.svg'
              width={20}
              height={20}
              alt='client'
              className='shrink-0'
            />
            <div className='flex flex-col'>
              <span className='text-sm font-semibold leading-tight'>
                {selectedClient.name}
              </span>
              <span className='text-xs text-muted-foreground'>
                {selectedClient.email}
              </span>
            </div>
          </div>
          <div className='flex items-center gap-0.5'>
            <Button
              variant='ghost'
              size='icon'
              className='h-7 w-7'
              onClick={handleEdit}
            >
              <PenSquare className='h-4 w-4 text-muted-foreground' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              className='h-7 w-7'
              onClick={handleUnselect}
            >
              <Image src='/svg/X.svg' width={16} height={16} alt='unselect' />
            </Button>
          </div>
        </div>
      ) : (
        <>
          <FormField
            control={form.control}
            name='toName'
            render={() => (
              <FormItem>
                <Select onValueChange={handleSelectClient}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select client' />
                  </SelectTrigger>
                  <SelectContent>
                    {clients?.length ? (
                      clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value='__empty__' disabled>
                        No clients yet
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            variant='ghost'
            className='w-fit'
            onClick={() => {
              setEditingClient(null);
              setDrawerOpen(true);
            }}
          >
            <Plus />
            Add new client
          </Button>
        </>
      )}

      <AddClientDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        client={editingClient}
        onSaved={onDrawerSaved}
      />
    </Card>
  );
}
