import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { ClientAPI } from '@/api/clients/types';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';

import { useCreateClient } from '../../hooks/use-create-client';
import { useUpdateClient } from '../../hooks/use-update-client';

const clientSchema = z.object({
  name: z.string().min(1, 'Client name is required'),
  email: z.string().email('Must be a valid email'),
  hasAddress: z.boolean(),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  zip: z.string().optional(),
});

type ClientFormValues = z.infer<typeof clientSchema>;

export function AddClientDrawer({
  open,
  onOpenChange,
  client,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client?: ClientAPI | null;
  onSaved?: (client: ClientAPI) => void;
}) {
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: '',
      email: '',
      hasAddress: false,
      street: '',
      city: '',
      state: '',
      country: '',
      zip: '',
    },
  });

  const hasAddress = form.watch('hasAddress');

  useEffect(() => {
    if (open) {
      if (client) {
        form.reset({
          name: client.name,
          email: client.email,
          hasAddress: !!client.street || !!client.city,
          street: client.street || '',
          city: client.city || '',
          state: client.state || '',
          country: client.country || '',
          zip: client.zip || '',
        });
      } else {
        form.reset({
          name: '',
          email: '',
          hasAddress: false,
          street: '',
          city: '',
          state: '',
          country: '',
          zip: '',
        });
      }
    }
  }, [open, client, form]);

  const onSubmit = async (values: ClientFormValues) => {
    const dataToSave = {
      name: values.name,
      email: values.email,
      street: values.hasAddress ? values.street : undefined,
      city: values.hasAddress ? values.city : undefined,
      state: values.hasAddress ? values.state : undefined,
      country: values.hasAddress ? values.country : undefined,
      zip: values.hasAddress ? values.zip : undefined,
    };

    if (client) {
      updateClient.mutate(
        { id: client.id, data: dataToSave },
        {
          onSuccess: (updated) => {
            onOpenChange(false);
            onSaved?.(updated);
          },
        }
      );
    } else {
      createClient.mutate(dataToSave, {
        onSuccess: (created) => {
          onOpenChange(false);
          onSaved?.(created);
        },
      });
    }
  };

  const isPending = createClient.isPending || updateClient.isPending;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='flex w-full max-w-md flex-col p-6 sm:max-w-md'>
        <SheetHeader>
          <SheetTitle className='text-xl font-bold'>
            {client ? 'Edit client' : 'Add new client'}
          </SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-1 flex-col gap-6 pt-6'
          >
            <ScrollArea className='flex-1 border-t px-1 pb-4 pt-6 -mx-1 -mt-6'>
              <div className='flex flex-col gap-6 p-1'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client name</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter client name' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type='email'
                          placeholder='Enter email'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='hasAddress'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm'>
                      <div className='space-y-0.5'>
                        <FormLabel>Address</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {hasAddress && (
                  <div className='flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-300'>
                    <FormField
                      control={form.control}
                      name='street'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street name 1</FormLabel>
                          <FormControl>
                            <Input placeholder='Enter street name' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className='flex gap-4'>
                      <FormField
                        control={form.control}
                        name='city'
                        render={({ field }) => (
                          <FormItem className='flex-1'>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder='Enter city' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='state'
                        render={({ field }) => (
                          <FormItem className='flex-1'>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input placeholder='Enter state' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className='flex gap-4'>
                      <FormField
                        control={form.control}
                        name='country'
                        render={({ field }) => (
                          <FormItem className='flex-1'>
                            <FormLabel>Country</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='Select country' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {/* TODO: Replace with generic country list component if it exists */}
                                <SelectItem value='US'>United States</SelectItem>
                                <SelectItem value='GB'>United Kingdom</SelectItem>
                                <SelectItem value='CA'>Canada</SelectItem>
                                <SelectItem value='AU'>Australia</SelectItem>
                                <SelectItem value='AE'>United Arab Emirates</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='zip'
                        render={({ field }) => (
                          <FormItem className='flex-1'>
                            <FormLabel>Zip Code</FormLabel>
                            <FormControl>
                              <Input placeholder='Enter zip' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            <div className='pt-4 pb-2'>
              <Button type='submit' className='w-full p-6 text-base font-semibold' disabled={isPending}>
                {isPending ? 'Saving...' : client ? 'Save changes' : 'Save new'}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
