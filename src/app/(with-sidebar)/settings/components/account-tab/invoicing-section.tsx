'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';
import { useFormContext } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { SETTINGS_CONFIG } from '../../constants';
import type { AccountFormData } from '../../schemas';
import { SettingsSection } from '../settings-section';

export const InvoicingSection = () => {
  const form = useFormContext<AccountFormData>();
  const countryOptions = SETTINGS_CONFIG.address.countries; // [{label, value}]

  return (
    <SettingsSection
      label='Invoicing'
      description='Details used on your invoices'
    >
      <div className='space-y-4'>
        <FormField
          name='businessName'
          control={form.control}
          render={({ field }) => (
            <FormItem className='w-full max-w-md'>
              <FormLabel>Business name</FormLabel>
              <FormControl>
                <Input placeholder='Sorbet' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name='taxId'
          control={form.control}
          render={({ field }) => (
            <FormItem className='w-full max-w-md'>
              <FormLabel>Tax ID</FormLabel>
              <FormControl>
                <Input placeholder='35346437' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='space-y-3'>
          <div className='text-sm font-medium'>Address</div>

          <FormField
            name='street'
            control={form.control}
            render={({ field }) => (
              <FormItem className='w-full max-w-md'>
                <FormControl>
                  <Input placeholder='Street' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='grid max-w-md grid-cols-2 gap-3'>
            <FormField
              name='state'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder='State' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name='addressCity'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder='City' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Country — searchable combobox (Popover + Command) */}
          <FormField
            name='country'
            control={form.control}
            render={({ field }) => {
              const selected = countryOptions.find(
                (c) => c.value === field.value
              );

              return (
                <FormItem className='w-full max-w-md'>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type='button'
                          variant='outline'
                          role='combobox'
                          aria-expanded={false}
                          className='w-full justify-between'
                        >
                          {selected ? selected.label : 'Select country…'}
                          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent
                        side='bottom'
                        align='start'
                        sideOffset={4}
                        collisionPadding={8}
                        className='w-[--radix-popover-trigger-width] p-0'
                      >
                        <Command>
                          <CommandInput placeholder='Search country…' />
                          <CommandEmpty>No country found.</CommandEmpty>

                          {/* internal scroll so page never jumps */}
                          <CommandList className='max-h-64 overflow-auto'>
                            <CommandGroup>
                              {countryOptions.map((c) => (
                                <CommandItem
                                  key={c.value}
                                  value={c.label}
                                  onSelect={() => {
                                    field.onChange(c.value);
                                  }}
                                >
                                  <Check
                                    className={[
                                      'mr-2 h-4 w-4',
                                      c.value === field.value
                                        ? 'opacity-100'
                                        : 'opacity-0',
                                    ].join(' ')}
                                  />
                                  {c.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            name='postalCode'
            control={form.control}
            render={({ field }) => (
              <FormItem className='w-full max-w-md'>
                <FormControl>
                  <Input placeholder='Postal code' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </SettingsSection>
  );
};
