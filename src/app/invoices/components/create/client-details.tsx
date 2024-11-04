'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight } from '@untitled-ui/icons-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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

import { CreateInvoiceFooter } from './create-invoice-footer';
import {
  CreateInvoiceHeader,
  CreateInvoiceTitle,
} from './create-invoice-header';
import { CreateInvoiceShell } from './create-invoice-shell';
import { useInvoiceFormContext } from './invoice-form-context';
import { Stepper } from './stepper';
import { invoiceFormStringValidator } from './utils';

const formSchema = z.object({
  fromName: invoiceFormStringValidator('Name'),
  fromEmail: invoiceFormStringValidator('Email'),
  toName: invoiceFormStringValidator('Name'),
  toEmail: invoiceFormStringValidator('Email'),
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
  const { formData, serializeFormData } = useInvoiceFormContext();

  const form = useForm<ClientDetailsFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      toName: formData.toName ?? '',
      toEmail: formData.toEmail ?? '',
      fromName: name ?? formData.fromName ?? '',
      fromEmail: email ?? formData.fromEmail ?? '',
    },
    mode: 'all',
  });

  const router = useRouter();
  const handleSubmit = form.handleSubmit((data, event) => {
    event?.preventDefault();
    const newFormData = { ...formData, ...data };
    onSubmit?.(newFormData);
    router.push(
      `/invoices/create/invoice-details${serializeFormData(newFormData)}`
    );
  });

  return (
    <CreateInvoiceShell>
      <CreateInvoiceHeader>
        <CreateInvoiceTitle>Client Details</CreateInvoiceTitle>
        <Stepper step={1} totalSteps={3} />
      </CreateInvoiceHeader>
      <Form {...form}>
        <form onSubmit={handleSubmit} className='flex w-full flex-col gap-12'>
          <Block label='From'>
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
                    <Input placeholder='Your email address' {...field} />
                  </FormControl>
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
                    <Input placeholder='Client email address' {...field} />
                  </FormControl>
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
