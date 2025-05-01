'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import {
  addressDefaultValues,
  AddressFormFields,
  addressSchema,
} from './address-form';

const usAccountSchema = z.object({
  account_number: z.string().min(1, 'Account number is required'),
  routing_number: z
    .string()
    .length(9, 'Routing number must be exactly 9 characters'),
  checking_or_savings: z.string().optional().default('checking'),
});
type USAccount = z.infer<typeof usAccountSchema>;

const usAccountDefaultValues: USAccount = {
  account_number: '',
  routing_number: '',
  checking_or_savings: 'checking',
};

const formSchema = z.object({
  currency: z.enum(['usd', 'eur']), // Corresponds to to account_type us and iban
  bank_name: z.string().min(1).max(256).optional(),
  account_owner_name: z
    .string()
    .min(3)
    .max(35)
    // See https://apidocs.bridge.xyz/reference/post_customers-customerid-external-accounts
    .regex(/^(?!\s*$)[\x20-\x7E]*$/, {
      message: 'Name contains invalid characters',
    }),

  // TODO: Required when currency is eur
  account_owner_type: z.enum(['individual', 'company']),
  // Individual: first_name and last_name could be split from account_owner_name
  // Company: business_name could be copied from account_owner_name

  // Only for currency usd
  account: usAccountSchema,

  // Only for currency eur
  // iban: ibanAccountSchema

  // Address
  ...addressSchema.shape,
});

export const bankFormId = 'bank-form';

export const BankForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currency: 'usd',
      account_owner_type: 'individual',
      account: usAccountDefaultValues,
      ...addressDefaultValues,
    },
    mode: 'onBlur',
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values);
      toast(
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>{JSON.stringify(values, null, 2)}</code>
        </pre>
      );
    } catch (error) {
      console.error('Form submission error', error);
      toast.error('Failed to submit the form. Please try again.');
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='mx-auto w-full max-w-sm space-y-4'
        id={bankFormId}
      >
        <FormField
          control={form.control}
          name='currency'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Currency</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a currency' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='usd'>USD</SelectItem>
                  {/* <SelectItem value='EUR'>EUR</SelectItem> */}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='bank_name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bank name</FormLabel>
              <FormControl>
                <Input placeholder='The name of your bank' type='' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='account_owner_name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Owner</FormLabel>
              <FormControl>
                <Input placeholder='First Last' type='' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='account_owner_type'
          render={({ field }) => (
            <FormItem className='space-y-3'>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <Tabs onValueChange={field.onChange} defaultValue={field.value}>
                  <TabsList className='w-full'>
                    <TabsTrigger value='individual' className='flex-1'>
                      Individual
                    </TabsTrigger>
                    <TabsTrigger value='company' className='flex-1'>
                      Company
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='account.account_number'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Number</FormLabel>
              <FormControl>
                <Input placeholder='Account number' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='account.routing_number'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Routing Number</FormLabel>
              <FormControl>
                <Input placeholder='9-digit routing number' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='account.checking_or_savings'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value || 'checking'}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select account type' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='checking'>Checking</SelectItem>
                  <SelectItem value='savings'>Savings</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <AddressFormFields />

        <Button
          variant='sorbet'
          type='submit'
          disabled={!form.formState.isValid}
          className='ml-auto'
        >
          Save
        </Button>
      </form>
    </Form>
  );
};
