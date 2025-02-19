import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { invoiceFormStringValidator } from '@/app/invoices/v2/schema';
import { FormControl, FormMessage } from '@/components/ui/form';
import { FormItem, FormLabel } from '@/components/ui/form';
import { FormField } from '@/components/ui/form';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  fromName: invoiceFormStringValidator('Name'),
  fromEmail: invoiceFormStringValidator('Email').email({
    message: 'Must be a valid email address',
  }),
});

export type YourInfoFormData = z.infer<typeof formSchema>;

export const YourInfo = () => {
  const form = useForm<YourInfoFormData>({
    resolver: zodResolver(formSchema),
  });

  return (
    <Form {...form}>
      <form action=''>
        <FormField
          name='fromName'
          control={form.control}
          render={({ field }) => (
            <FormItem className='w-full max-w-md'>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder='Your name' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name='fromEmail'
          control={form.control}
          render={({ field }) => (
            <FormItem className='w-full max-w-md'>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type='email'
                  placeholder='Your email address'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
