'use client';

import { useFormContext } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import MapPinIcon from '~/svg/map-pin.svg';

import type { ProfileFormData } from '../../schemas';
import { SettingsSection } from '../settings-section';

export const BasicInfoSection = () => {
  const form = useFormContext<ProfileFormData>();

  return (
    <SettingsSection
      label='Basic information'
      description='Name and location to be displayed on your profile header'
    >
      <FormField
        name='firstName'
        control={form.control}
        render={({ field }) => (
          <FormItem className='w-full max-w-md'>
            <FormLabel>First name</FormLabel>
            <FormControl>
              <Input placeholder='Your first name' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name='lastName'
        control={form.control}
        render={({ field }) => (
          <FormItem className='w-full max-w-md'>
            <FormLabel>Last name</FormLabel>
            <FormControl>
              <Input placeholder='Your last name' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name='city'
        control={form.control}
        render={({ field }) => (
          <FormItem className='w-full max-w-md'>
            <FormLabel>Location</FormLabel>
            <FormControl>
              <div className='relative'>
                <div className='pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2'>
                  <MapPinIcon className='text-muted-foreground size-4' />
                </div>
                <Input className='pl-9' placeholder='New York' {...field} />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </SettingsSection>
  );
};
