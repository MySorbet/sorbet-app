'use client';

import { useLogin } from '@privy-io/react-auth';
import { Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Loading } from '@/components/common';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks';

import { FormContainer } from './form-container';

/** Simple sign in form which calls out to privy */
export const PrivyLogin = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const { loginWithEmail } = useAuth();
  const router = useRouter();

  const { login } = useLogin({
    onComplete: async (user, isNew, wasAlreadyAuthed) => {
      console.log(wasAlreadyAuthed);

      // Rather than use email, we should use did
      if (user.email === undefined) {
        console.error('No email found in user object');
        return;
      }

      // Fetch user from sorbet
      setLoading(true);
      const sorbetUser = await loginWithEmail(user.email.address);
      console.log(sorbetUser);
      router.replace(`/${sorbetUser.data.accountId.split('.')[0]}`);
    },
  });

  return (
    <FormContainer>
      {isLoading && <Loading />}
      <h1 className='text-2xl font-semibold'>Sign In</h1>
      <Button className='bg-sorbet' onClick={login}>
        Log in
      </Button>
    </FormContainer>
  );
};
