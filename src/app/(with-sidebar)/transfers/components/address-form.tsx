'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFormContext } from 'react-hook-form';
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

/** Zod schema for a bank address */
export const addressSchema = z.object({
  address: z.object({
    address_line_1: z.string().min(5).max(100),
    address_line_2: z.string().max(100).optional(),
    city: z.string().min(2).max(50),
    state: z
      .string()
      .refine((val) => !val || isISO31662(val), {
        message: 'Invalid state code',
      })
      .optional(),
    postal_code: z
      .string()
      .refine((val) => !val || isPostalCode(val, 'US'), {
        message: 'Invalid postal code',
      })
      .optional(),
    country: z.string().refine((val) => isISO31661Alpha3(val), {
      message: 'Invalid country code',
    }),
  }),
});

export type AddressFormValues = z.infer<typeof addressSchema>;

export const addressDefaultValues: AddressFormValues = {
  address: {
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'USA',
  },
};

export const AddressForm = ({
  onSubmit,
}: {
  onSubmit: (values: AddressFormValues) => void;
}) => {
  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: addressDefaultValues,
    mode: 'onBlur',
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='mx-auto w-full max-w-sm space-y-4'
      >
        <AddressFormFields />
        <Button type='submit' disabled={!form.formState.isValid}>
          Submit
        </Button>
      </form>
    </Form>
  );
};

export const AddressFormFields = () => {
  const form = useFormContext<AddressFormValues>();

  return (
    <>
      <FormField
        control={form.control}
        name='address.address_line_1'
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
        name='address.address_line_2'
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
        name='address.city'
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
        name='address.state'
        render={({ field }) => (
          <FormItem>
            <FormLabel>State</FormLabel>
            <FormControl>
              <StateSelect
                value={field.value ?? ''}
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
        name='address.postal_code'
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
        name='address.country'
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
    </>
  );
};
