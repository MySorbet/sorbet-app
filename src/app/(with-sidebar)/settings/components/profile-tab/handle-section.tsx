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

import type { ProfileFormData } from '../../schemas';
import { SETTINGS_CONFIG } from '../../constants';
import { SettingsSection } from '../settings-section';

export const HandleSection = () => {
  const form = useFormContext<ProfileFormData>();

  return (
    <SettingsSection
      label='Handle'
      description='Claim your unique Sorbet handle'
    >
      <FormField
        name='handle'
        control={form.control}
        render={({ field }) => (
          <FormItem className='w-full max-w-md'>
            <FormLabel>Handle</FormLabel>
            <FormControl>
              <div className='flex items-center'>
                <span className='text-muted-foreground inline-flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm'>
                  {SETTINGS_CONFIG.handle.baseUrl}
                </span>
                <Input
                  className='rounded-l-none'
                  placeholder='my-handle-01'
                  {...field}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </SettingsSection>
  );
};


