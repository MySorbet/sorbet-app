'use client';

import { Loading02 } from '@untitled-ui/icons-react';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks';

import { FormContainer } from './form-container';

/** Simple sign in form which calls out to privy */
export const PrivyLogin = () => {
  const { login, loading } = useAuth();

  return (
    <FormContainer>
      <div className='flex size-full items-center justify-center'>
        <Button className='bg-sorbet' onClick={login} disabled={loading}>
          {loading ? (
            <Loading02 className='animate animate-spin' />
          ) : (
            'Log in or sign up'
          )}
        </Button>
      </div>
    </FormContainer>
  );
};
