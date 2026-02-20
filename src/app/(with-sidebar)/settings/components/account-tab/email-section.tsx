'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks';

import { SettingsSection } from '../settings-section';

export const EmailSection = () => {
  const { user } = useAuth();

  return (
    <SettingsSection label='Email' description='Set your account email'>
      <div className='w-full max-w-md space-y-2'>
        <Label>Email address</Label>
        <Input
          value={user?.email || ''}
          readOnly
          className='bg-muted cursor-not-allowed'
        />
      </div>
    </SettingsSection>
  );
};
