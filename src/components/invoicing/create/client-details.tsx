import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight } from '@untitled-ui/icons-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { CreateInvoiceFooter } from './create-invoice-footer';
import { CreateInvoiceHeader } from './create-invoice-header';

const formSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().min(2).max(50),
});

/**
 * Create Invoice Step 1
 * Capture client name and email
 */
export const ClientDetails = ({
  onSubmit,
  name,
  email,
}: {
  onSubmit?: (values: z.infer<typeof formSchema>) => void;
  name: string;
  email: string;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  return (
    <div className='flex flex-col gap-12'>
      <CreateInvoiceHeader step={1}>Client</CreateInvoiceHeader>
      <div className='flex justify-between'>
        <span className='text-sm font-medium'>From</span>
        <FromFreelancer name={name} email={email} />
      </div>
      <Form {...form}>
        <form onSubmit={onSubmit ? form.handleSubmit(onSubmit) : undefined}>
          <div className='flex justify-between'>
            <span className='text-sm font-medium'>Bill To</span>

            <div className='flex flex-col gap-2'>
              <FormField
                name='name'
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <Input placeholder='Client name' {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name='email'
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <Input placeholder='Client email address' {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <CreateInvoiceFooter>
            <Button
              className='bg-sorbet ml-auto'
              type='submit'
              disabled={form.formState.isSubmitting || !form.formState.isValid}
            >
              Invoice Details <ArrowRight className='ml-2 h-4 w-4' />
            </Button>
          </CreateInvoiceFooter>
        </form>
      </Form>
    </div>
  );
};

/**
 * Local component to display freelancer name and email (we already know this)
 */
const FromFreelancer = ({ name, email }: { name: string; email: string }) => {
  return (
    <div className='flex flex-col gap-2'>
      <div className='grid w-full max-w-sm items-center gap-1.5'>
        <Label htmlFor='name' className='text-sm font-medium'>
          Name
        </Label>
        <Input id='name' placeholder='Name' value={name} disabled />
      </div>
      <div className='grid w-full max-w-sm items-center gap-1.5'>
        <Label htmlFor='email' className='text-sm font-medium'>
          Email
        </Label>
        <Input
          type='email'
          id='email'
          placeholder='Email'
          value={email}
          disabled
        />
      </div>
    </div>
  );
};
