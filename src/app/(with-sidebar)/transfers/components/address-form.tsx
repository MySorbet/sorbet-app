'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { iso31661 } from 'iso-3166';
import { useMemo } from 'react';
import { useForm, useFormContext, useWatch } from 'react-hook-form';
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
    street_line_1: z.string().min(5).max(100),
    street_line_2: z.string().max(100).optional(),
    city: z.string().min(2).max(50),
    state: z
      .string()
      .refine((val) => !val || isISO31662(val), {
        message: 'Invalid state code',
      })
      .optional(),
    // TODO: Verify state corresponds with country
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
    street_line_1: '',
    street_line_2: '',
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

  // Get the alpha2 of the country selected
  const country = useWatch({ control: form.control, name: 'address.country' });
  const parent = useMemo(
    () => iso31661.find((c) => c.alpha3 === country)?.alpha2,
    [country]
  );

  return (
    <>
      <FormField
        control={form.control}
        name='address.street_line_1'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Street Line 1</FormLabel>
            <FormControl>
              <Input placeholder='123 Main St' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='address.street_line_2'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Street Line 2</FormLabel>
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
      <div className='flex gap-2'>
        <FormField
          control={form.control}
          name='address.state'
          render={({ field }) => (
            <FormItem className='w-[60%]'>
              <FormLabel>State</FormLabel>
              <FormControl>
                <StateSelect {...field} parent={parent} disabled={!parent} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='address.postal_code'
          render={({ field }) => (
            <FormItem className='w-[40%]'>
              <FormLabel>Postal Code</FormLabel>
              <FormControl>
                <Input placeholder='94105' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
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
                // Reset the state if the country changes
                form.setValue('address.state', '', {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }}
            />
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
