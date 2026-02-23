import { Check, ChevronsUpDown, PenSquare,Plus } from 'lucide-react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { ClientAPI } from '@/api/clients/types';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

import { useClients } from '../../hooks/use-clients';
import { InvoiceForm } from '../../schema';
import { AddClientDrawer } from './add-client-drawer';

export function ClientSelector() {
  const form = useFormContext<InvoiceForm>();
  const [open, setOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // Track selected client internally to manage edits
  const [selectedClient, setSelectedClient] = useState<ClientAPI | null>(null);
  const [editingClient, setEditingClient] = useState<ClientAPI | null>(null);

  const { data: clients } = useClients();

  const handleSelectClient = (client: ClientAPI) => {
    setSelectedClient(client);
    form.setValue('toName', client.name);
    form.setValue('toEmail', client.email);
    
    // Convert client address to invoice form address schema if present
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
    
    setOpen(false);
  };

  const handleAddNewClient = () => {
    setEditingClient(null);
    setDrawerOpen(true);
    setOpen(false);
  };

  const handleEditClient = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedClient) {
      setEditingClient(selectedClient);
      setDrawerOpen(true);
    }
  };

  const onDrawerSaved = (client: ClientAPI) => {
    handleSelectClient(client);
  };

  return (
    <div className='w-full'>
      <FormField
        control={form.control}
        name='toName' // We tie the validation state to the toName requirement
        render={() => (
          <FormItem className='flex flex-col'>
            <FormLabel>Client</FormLabel>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  role='combobox'
                  aria-expanded={open}
                  className={cn(
                    'w-full justify-between',
                    !selectedClient && 'text-muted-foreground'
                  )}
                >
                  {selectedClient ? selectedClient.name : 'Select client'}
                  <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-[400px] p-0' align='start'>
                <Command>
                  <CommandInput placeholder='Search clients...' />
                  <CommandList>
                    <CommandEmpty>No clients found.</CommandEmpty>
                    <CommandGroup>
                      {clients?.map((client) => (
                        <CommandItem
                          key={client.id}
                          value={client.name}
                          onSelect={() => handleSelectClient(client)}
                          className='flex justify-between items-center'
                        >
                          <div className='flex items-center'>
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                selectedClient?.id === client.id
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                            <div className='flex flex-col'>
                              <span>{client.name}</span>
                              <span className='text-xs text-muted-foreground'>
                                {client.email}
                              </span>
                            </div>
                          </div>
                          {selectedClient?.id === client.id && (
                            <Button
                              variant='ghost'
                              size='icon'
                              className='h-6 w-6'
                              onClick={handleEditClient}
                            >
                              <PenSquare className='h-4 w-4' />
                            </Button>
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                  <div className='p-2 border-t'>
                    <Button
                      variant='ghost'
                      className='w-full justify-start text-primary font-medium'
                      onClick={handleAddNewClient}
                    >
                      <Plus className='mr-2 h-4 w-4' />
                      Add new client
                    </Button>
                  </div>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      <AddClientDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        client={editingClient}
        onSaved={onDrawerSaved}
      />
    </div>
  );
}
