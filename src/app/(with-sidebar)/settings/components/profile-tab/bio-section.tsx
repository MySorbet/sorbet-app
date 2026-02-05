'use client';

import { useFormContext } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

import { SETTINGS_CONFIG } from '../../constants';
import type { ProfileFormData } from '../../schemas';
import { SettingsSection } from '../settings-section';

export const BioSection = () => {
  const form = useFormContext<ProfileFormData>();

  return (
    <SettingsSection
      label='Bio'
      description='Bio description displayed in your profile header'
    >
      <FormField
        name='bio'
        control={form.control}
        render={({ field }) => (
          <FormItem className='w-full max-w-md'>
            <FormLabel>Describe</FormLabel>
            <FormControl>
              <Textarea
                placeholder={SETTINGS_CONFIG.bio.placeholder}
                className='resize-none'
                rows={4}
                maxLength={SETTINGS_CONFIG.bio.maxLength}
                {...field}
              />
            </FormControl>
            <p className='text-muted-foreground mt-1 text-xs'>
              Max. {SETTINGS_CONFIG.bio.maxLength} characters
            </p>
            <FormMessage />
          </FormItem>
        )}
      />
    </SettingsSection>
  );
};
