'use client';

import { useLogin, usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { signUpWithPrivyId } from '@/api/auth';
import { Loading } from '@/components/common';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks';
import { useAppDispatch } from '@/redux/hook';
import { updateUserData } from '@/redux/userSlice';
import { User } from '@/types';

import { FormContainer } from './form-container';

/** Simple sign in form which calls out to privy */
export const PrivyLogin = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const { loginWithPrivyId } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { logout } = usePrivy();
  const dispatch = useAppDispatch();

  const { login } = useLogin({
    onComplete: async (user, isNewUser, wasAlreadyAuthenticated) => {
      console.log('wasAlreadyAuthenticated: ', wasAlreadyAuthenticated);

      // This is a signup so create a user in the sorbet db, put it in redux and redirect to signup
      if (isNewUser) {
        console.log(
          'This is a new user. Creating a sorbet user and redirecting to signup'
        );
        const newUser = await signUpWithPrivyId({ id: user.id });
        // TODO: Maybe we should give them a temp handle so that they can see their profile in case handle update fails?
        dispatch(updateUserData(newUser.data as unknown as User));
        console.log(newUser.data);
        router.replace('/signup');
        return;
      }

      // Fetch user from sorbet
      setLoading(true);
      const loginResult = await loginWithPrivyId(user.id);

      // If the login fails, log out and show an error
      if (loginResult.status === 'failed') {
        await logout();
        setLoading(false);
        toast({
          title: 'Error',
          description: `Error logging in: ${loginResult.error?.message}`,
          variant: 'destructive',
        });
        return;
      }

      // If you get here, the login was successful and you have a sorbet user. Route to their profile
      console.log(loginResult);
      const sorbetUser = loginResult.data;
      router.replace(`/${sorbetUser.handle}`);
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
