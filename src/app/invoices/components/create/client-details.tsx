'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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
import { CreateInvoiceHeader } from './create-invoice-header';
import { CreateInvoiceShell } from './create-invoice-shell';
import { CreateInvoiceTitle } from './create-invoice-title';
import { ForwardButton } from './forward-button';
import { useInvoiceFormContext } from './invoice-form-context';
import { Stepper } from './stepper';
import { invoiceFormStringValidator } from './utils';

const formSchema = z.object({
  fromName: invoiceFormStringValidator('Name'),
  fromEmail: invoiceFormStringValidator('Email').email({
    message: 'Must be a valid email address',
  }),
  toName: invoiceFormStringValidator('Name'),
  toEmail: invoiceFormStringValidator('Email').email({
    message: 'Must be a valid email address',
  }),
});

export type ClientDetailsFormSchema = z.infer<typeof formSchema>;

/**
 * Create Invoice Step 1
 * Capture client and freelancer details
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
    mode: 'onTouched',
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
          </Block>
          <CreateInvoiceFooter>
            <ForwardButton
              className='ml-auto'
              disabled={form.formState.isSubmitting || !form.formState.isValid}
            >
              Invoice Details
            </ForwardButton>
          </CreateInvoiceFooter>
        </form>
      </Form>
    </CreateInvoiceShell>
  );
};

/**
 * Local component to render a single block of form fields. Used to group related fields together.
 */
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
