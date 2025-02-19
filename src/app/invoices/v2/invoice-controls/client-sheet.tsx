import { useForm } from 'react-hook-form';

import { Spinner } from '@/components/common/spinner';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';

import { Client, emptyAddress } from '../schema';

/**
 * Sheet allowing a client to be added or edited.
 * Pass a `client` to edit an existing client, or omit it to add a new client.
 */
export const ClientSheet = ({
  open,
  setOpen,
  client,
  onSave,
  isSaving,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  client?: Client;
  onSave: (client: Client, isEditing: boolean) => Promise<void>;
  isSaving?: boolean;
}) => {
  const isEditing = Boolean(client);
  const title = isEditing ? 'Edit client' : 'Add client';
  const description = 'Client details will appear on your invoices';
  const submitButtonText = isSaving
    ? 'Saving...'
    : isEditing
    ? 'Save'
    : 'Save new';
  const form = useForm<Client>({
    values: client,
    defaultValues: {
      name: '',
      email: '',
      address: undefined,
    },
  });

  const showAddress = Boolean(form.watch('address'));

  const handleSave = async (client: Client) => {
    await onSave(client, isEditing);
    setOpen(false);
  };

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetContent className='flex h-full w-full flex-col gap-4 p-6'>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSave)}
            className='flex flex-col gap-4'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription />
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
                    <Input {...field} />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex items-center justify-between gap-2'>
              <FormLabel htmlFor='address-toggle'>Address</FormLabel>
              <Switch
                id='address-toggle'
                checked={showAddress}
                onCheckedChange={(checked) => {
                  form.setValue('address', checked ? emptyAddress : undefined);
                }}
              />
            </div>
            {showAddress && (
              <div className='animate-in fade-in-0 slide-in-from-top-5 flex flex-col gap-2'>
                <FormField
                  control={form.control}
                  name='address.street'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} placeholder='Street' />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='flex gap-2'>
                  <FormField
                    control={form.control}
                    name='address.city'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} placeholder='City' />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='address.state'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} placeholder='State' />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name='address.country'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} placeholder='Country' />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='address.zip'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} placeholder='Zip' />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            <Button
              type='submit'
              disabled={isSaving}
              variant='sorbet'
              className='ml-auto'
            >
              {isSaving && <Spinner />}
              {submitButtonText}
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};
