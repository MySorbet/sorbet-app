import { useState } from 'react';

import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

import { emptyAddress } from '../../schema';
import { useInvoiceForm } from '../../hooks/use-invoice-form';

/**
 * A fake client card that renders form fields for the client name and email.
 * This is used instead of hte real client card until we perform the necessary DB migrations.
 */
export const ClientCardShim = () => {
  const form = useInvoiceForm();
  const [showAddress, setShowAddress] = useState(false);

  const handleAddressToggle = (checked: boolean) => {
    setShowAddress(checked);
    if (checked) {
      form.setValue('toAddress', emptyAddress);
    } else {
      form.setValue('toAddress', undefined);
    }
  };

  return (
    <div className='flex w-full flex-col gap-4'>
      <div className='flex w-full justify-between gap-2'>
        <FormField
          name='toName'
          control={form.control}
          render={({ field }) => (
            <FormItem className='w-full max-w-md'>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder='Client name' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name='toEmail'
          control={form.control}
          render={({ field }) => (
            <FormItem className='w-full max-w-md'>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type='email'
                  placeholder='Client email address'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        name='toBusinessName'
        control={form.control}
        render={({ field }) => (
          <FormItem className='w-full max-w-md'>
            <FormLabel>Business Name (optional)</FormLabel>
            <FormControl>
              <Input
                placeholder='Client business name'
                {...field}
                value={field.value || ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className='flex items-center justify-between gap-2'>
        <FormLabel htmlFor='client-address-switch'>
          Client Address (optional)
        </FormLabel>
        <Switch
          id='client-address-switch'
          checked={showAddress}
          onCheckedChange={handleAddressToggle}
        />
      </div>

      {showAddress && (
        <div className='animate-in fade-in-0 slide-in-from-top-5 flex flex-col gap-2'>
          <FormField
            control={form.control}
            name='toAddress.street'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} placeholder='Street' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex gap-2'>
            <FormField
              control={form.control}
              name='toAddress.city'
              render={({ field }) => (
                <FormItem className='flex-1'>
                  <FormControl>
                    <Input {...field} placeholder='City' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='toAddress.state'
              render={({ field }) => (
                <FormItem className='flex-1'>
                  <FormControl>
                    <Input {...field} placeholder='State' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='flex gap-2'>
            <FormField
              control={form.control}
              name='toAddress.country'
              render={({ field }) => (
                <FormItem className='flex-1'>
                  <FormControl>
                    <Input {...field} placeholder='Country' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='toAddress.zip'
              render={({ field }) => (
                <FormItem className='flex-1'>
                  <FormControl>
                    <Input {...field} placeholder='Zip' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      )}
    </div>
  );
};
