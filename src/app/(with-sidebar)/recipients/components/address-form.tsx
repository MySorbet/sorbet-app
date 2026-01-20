'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { iso31661 } from 'iso-3166';
import { useMemo } from 'react';
import { useForm, useFormContext, useWatch } from 'react-hook-form';
import isISO31661Alpha3 from 'validator/lib/isISO31661Alpha3';
import isPostalCode from 'validator/lib/isPostalCode';
import { z } from 'zod';

import { InfoTooltip } from '@/components/common/info-tooltip/info-tooltip';
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

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
      .refine((val) => !val || isPostalCode(val, 'any'), {
        message: 'Invalid postal code',
      })
      .optional(),
    // TODO: Verify postal code matches selected region
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
    <div className='space-y-3'>
      {/* Beneficiary Address Section Header */}
      <div className='flex h-5 items-center gap-1'>
        <Label>Beneficiary Address</Label>
        <InfoTooltip>Address of the beneficiary of this account</InfoTooltip>
      </div>

      {/* Complete Street Address */}
      <FormField
        control={form.control}
        name='address.street_line_1'
        render={({ field }) => (
          <FormItem>
            <VisuallyHidden>
              <FormLabel>Complete Street Address</FormLabel>
            </VisuallyHidden>
            <FormControl>
              <Textarea
                placeholder='Complete Street Address'
                className='min-h-[80px] resize-none'
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Country */}
      <FormField
        control={form.control}
        name='address.country'
        render={({ field }) => (
          <FormItem>
            <VisuallyHidden>
              <FormLabel>Country</FormLabel>
            </VisuallyHidden>
            <CountryDropdown
              placeholder='Select Country'
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

      {/* State + City */}
      <div className='flex gap-2'>
        <FormField
          control={form.control}
          name='address.state'
          render={({ field }) => (
            <FormItem className='w-1/2'>
              <VisuallyHidden>
                <FormLabel>State</FormLabel>
              </VisuallyHidden>
              <FormControl>
                <StateSelect {...field} parent={parent} disabled={!parent} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='address.city'
          render={({ field }) => (
            <FormItem className='w-1/2'>
              <VisuallyHidden>
                <FormLabel>City</FormLabel>
              </VisuallyHidden>
              <FormControl>
                <Input placeholder='City' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Postal Code */}
      <FormField
        control={form.control}
        name='address.postal_code'
        render={({ field }) => (
          <FormItem>
            <VisuallyHidden>
              <FormLabel>Postal Code</FormLabel>
            </VisuallyHidden>
            <FormControl>
              <Input placeholder='Postal Code' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
