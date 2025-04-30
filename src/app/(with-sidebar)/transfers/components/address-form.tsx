'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import isISO31661Alpha3 from 'validator/lib/isISO31661Alpha3';
import isPostalCode from 'validator/lib/isPostalCode';
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

import { CountryDropdown } from './country-dropdown';
import { isISO31662, StateSelect } from './state-select';

// The shipping address schema
const addressSchema = z.object({
  addressLine1: z.string().min(5).max(100),
  addressLine2: z.string().max(100),
  city: z.string().min(2).max(50),
  state: z.string().refine((val) => isISO31662(val), {
    message: 'Invalid state code',
  }),
  postalCode: z.string().refine((val) => isPostalCode(val, 'US'), {
    message: 'Invalid postal code',
  }),
  country: z.string().refine((val) => isISO31661Alpha3(val), {
    message: 'Invalid country code',
  }),
});

export type AddressFormValues = z.infer<typeof addressSchema>;

export const AddressForm = () => {
  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'USA',
    },
    mode: 'all',
  });

  function onSubmit(values: AddressFormValues) {
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
      >
        <FormField
          control={form.control}
          name='addressLine1'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address Line 1</FormLabel>
              <FormControl>
                <Input placeholder='123 Main St' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='addressLine2'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address Line 2</FormLabel>
              <FormControl>
                <Input placeholder='Apt 4B' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='city'
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder='San Francisco' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='state'
          render={({ field }) => (
            <FormItem>
              <FormLabel>State</FormLabel>
              <FormControl>
                <StateSelect
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='postalCode'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Postal Code</FormLabel>
              <FormControl>
                <Input placeholder='94105' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='country'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <CountryDropdown
                placeholder='Country'
                defaultValue={field.value}
                onChange={(country) => {
                  field.onChange(country.alpha3);
                }}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' disabled={!form.formState.isValid}>
          Submit
        </Button>
      </form>
    </Form>
  );
};
