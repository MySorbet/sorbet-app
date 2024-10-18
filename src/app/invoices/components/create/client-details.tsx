'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight } from '@untitled-ui/icons-react';
import { useRouter } from 'next/navigation';
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

import { CreateInvoiceFooter } from './create-invoice-footer';
import { CreateInvoiceHeader } from './create-invoice-header';
import { CreateInvoiceShell } from './create-invoice-shell';
import { useInvoiceFormContext } from './invoice-form-context';

const formSchema = z.object({
  fromName: z.string().min(2).max(50),
  fromEmail: z.string().min(2).max(50),
  toName: z.string().min(2).max(50),
  toEmail: z.string().min(2).max(50),
});

export type ClientDetailsFormSchema = z.infer<typeof formSchema>;

/**
 * Create Invoice Step 1
 * Capture client name and email
 */
export const ClientDetails = ({
  onSubmit,
  name,
  email,
}: {
  onSubmit?: (values: ClientDetailsFormSchema) => void;
  name?: string;
  email?: string;
}) => {
  const { formData, setFormData } = useInvoiceFormContext();

  const form = useForm<ClientDetailsFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      toName: formData.toName,
      toEmail: formData.toEmail,
      fromName: name ?? formData.fromName,
      fromEmail: email ?? formData.fromEmail,
    },
  });

  const router = useRouter();
  const handleSubmit = form.handleSubmit((data, event) => {
    event?.preventDefault();
    const newFormData = { ...formData, ...data };
    setFormData(newFormData);
    onSubmit?.(newFormData);
    router.push(
      `/invoices/create/invoice-details?${new URLSearchParams(
        newFormData as unknown as Record<string, string>
      )}`
    );
  });

  return (
    <CreateInvoiceShell>
      <CreateInvoiceHeader step={1}>Client</CreateInvoiceHeader>
      <Form {...form}>
        <form onSubmit={handleSubmit} className='flex flex-col gap-12'>
          <Block label='From'>
            <FormField
              name='fromName'
              control={form.control}
              render={({ field }) => (
                <FormItem className='w-full max-w-md'>
                  <FormLabel>Name</FormLabel>
                  <Input placeholder='Your name' {...field} />
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
                  <Input placeholder='Your email address' {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </Block>

          <Block label='Bill To'>
            <FormField
              name='toName'
              control={form.control}
              render={({ field }) => (
                <FormItem className='w-full max-w-md'>
                  <FormLabel>Name</FormLabel>
                  <Input placeholder='Client name' {...field} />
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
                  <Input placeholder='Client email address' {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </Block>
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
    </CreateInvoiceShell>
  );
};

const Block = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => {
  return (
    <div className='flex justify-between gap-6'>
      <span className='text-sm font-medium'>{label}</span>
      <div className='flex flex-1 flex-col items-end gap-2'>{children}</div>
    </div>
  );
};
