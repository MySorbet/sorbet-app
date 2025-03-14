import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { useInvoiceForm } from '../../hooks/use-invoice-form';

/**
 * A fake client card that renders form fields for the client name and email.
 * This is used instead of hte real client card until we perform the necessary DB migrations.
 */
export const ClientCardShim = () => {
  const form = useInvoiceForm();
  return (
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
  );
};
