'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Wallet03 } from '@untitled-ui/icons-react';
import BN from 'bn.js';
import { randomBytes } from 'crypto';
import { sendSignInLinkToEmail } from 'firebase/auth';
import { CircleAlert, CircleCheck, Loader } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { z } from 'zod';

import { Loading } from '@/components/common';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth, useGetUserByAccountId, useLoginWithEmail } from '@/hooks';
import { config } from '@/lib/config';

import { FormContainer } from './form-container';

const schema = z.object({
  email: z.string().email({ message: 'Invalid email format' }),
});

interface CreateAccountParams {
  accountId: string | null;
  email: string;
  isRecovery: boolean;
  success_url?: string;
  failure_url?: string;
  public_key?: string;
  contract_id?: string;
  methodNames?: string;
}

export const handleCreateAccount = async ({
  accountId,
  email,
  isRecovery,
  success_url,
  failure_url,
  public_key,
  contract_id,
  methodNames,
}: CreateAccountParams) => {
  const searchParams = new URLSearchParams(
    Object.entries({
      ...(accountId ? { accountId } : {}),
      ...(isRecovery ? { isRecovery: 'true' } : {}),
      ...(success_url ? { success_url } : {}),
      ...(failure_url ? { failure_url } : {}),
      ...(public_key ? { public_key_lak: public_key } : {}),
      ...(contract_id ? { contract_id } : {}),
      ...(methodNames ? { methodNames } : {}),
    }).reduce((acc, [key, value]) => {
      if (value !== undefined) acc[key] = value;
      return acc;
    }, {} as Record<string, string>)
  );

  await sendSignInLinkToEmail(firebaseAuth, email, {
    url: encodeURI(
      `${config.fastAuthDomain}/auth-callback?${searchParams.toString()}`
    ),
    handleCodeInApp: true,
  });
  window.localStorage.setItem('emailForSignIn', email);
  return {
    accountId,
  };
};

/** Simple sign in form which calls out to fastauth */
export const SignIn = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const { register, handleSubmit, control } = useForm({
    resolver: zodResolver(schema),
  });
  const { isValidating, isValid, touchedFields } = useFormState({
    control,
  });

  const router = useRouter();
  const { toast } = useToast();
  const [activeNearAccount, setActiveNearAccount] = useState<string | null>(
    null
  );
  const [accountNotFound, setAccountNotFound] = useState<boolean>(false);

  const [isProcessingAuth, setIsProcessingAuth] = useState(false);

  const { user, accessToken, loginWithWallet } = useAuth();

  const { isPending: loginLoading, mutateAsync: loginWithEmail } =
    useLoginWithEmail();

  const {
    isPending: isGetUserAccountLoading,
    mutateAsync: getUserByAccountId,
  } = useGetUserByAccountId();

  useEffect(() => {
    const handleRedirectLogin = async () => {
      const urlHash = window.location.href;
      if (urlHash) {
        const params = new URLSearchParams(urlHash.split('?')[1]);
        const accountId = params.get('account_id');
        const publicKey = params.get('public_key');

        if (accountId && publicKey) {
          setLoading(true);
          const email = localStorage.getItem('emailForSignIn');
          if (email) {
            setLoading(true);
            const response = await loginWithEmail(email);
            if (response.status === 'success') {
              router?.push('/');
            } else {
              toast({
                title: 'Failed to login',
                description: response.message,
                variant: 'destructive',
              });
            }
          } else {
            toast({
              title: 'Error logging in',
              description:
                'There was a problem receiving your email address from NEAR. Please try again',
            });
            setLoading(false);
          }
        }
      }
    };

    handleRedirectLogin();
  }, [router]);

  useEffect(() => {
    if (user && accessToken) {
      router.push('/');
    }
  }, [user, router]);

  // Check if the wallet selector has an account and log into sorbet with it?
  useEffect(() => {
    const handleWalletLogin = async () => {
      const urlHash = window.location.hash;
      if (urlHash) {
        const params = new URLSearchParams(urlHash.substring(1));
        const accountId = params.get('accountId');
        const signature = params.get('signature');
        const publicKey = params.get('publicKey');

        if (accountId && signature && publicKey) {
          const response = await loginWithWallet(accountId);
          if (response.status === 'success') {
            setLoading(false);
            router?.push('/');
          } else {
            toast({
              title: 'Failed to login',
              description: response.message,
              variant: 'destructive',
            });
            setLoading(false);
          }
        }
      }
    };

    handleWalletLogin();
  }, [router]);

  // const handleWalletLogin = async (
  //   event: React.MouseEvent<HTMLButtonElement>
  // ) => {
  //   event.preventDefault();
  //   const challenge = randomBytes(32);
  //   const message = 'Login with Sorbet';
  //   await nearModal.show();

  //   if (accounts.length > 0) {
  //     const wallet = await selector.wallet();
  //     if (wallet) {
  //       const recipient = await wallet.getAccounts();
  //       if (recipient.length > 0) {
  //         await wallet.signMessage({
  //           message,
  //           recipient: recipient[0].accountId,
  //           nonce: challenge,
  //           callbackUrl: '',
  //         });
  //       } else {
  //         toast({
  //           title: 'No wallet accounts found',
  //           description:
  //             'Please make sure your wallet has accounts and is connected.',
  //           variant: 'destructive',
  //         });
  //       }
  //     }
  //   }
  // };

  return (
    <FormContainer>
      {isLoading && <Loading />}
      <h1 className='text-2xl font-semibold'>Sign In</h1>
      <form
        onSubmit={() => loginWithEmail}
        id='signin-form'
        className='flex flex-1 flex-col justify-between gap-4 px-0 py-2'
      >
        <div className='flex h-28 flex-col gap-[6px] '>
          <Label htmlFor='email'>Email</Label>
          <div className='relative'>
            <Input
              className={
                !isValid && touchedFields.email
                  ? 'border-red-500 ring-red-500'
                  : ''
              }
              {...register('email', {
                required: 'Please enter a valid email address',
              })}
            />
            {isValidating && (
              <Loader className='absolute right-4  top-3 h-4 w-4' />
            )}
            {touchedFields.email ? (
              isValid ? (
                <CircleCheck className='absolute right-4 top-3 h-4 w-4 text-[#079455]' />
              ) : (
                <CircleAlert className='absolute right-4 top-3 h-4 w-4 text-[#D92D20]' />
              )
            ) : null}
          </div>
          {!isValid && touchedFields.email && (
            <p className='text-sm text-red-500'>Invalid email format</p>
          )}
        </div>
        <div className='flex h-full flex-col justify-between'>
          <div
            id='button-container'
            className='flex flex-col items-center gap-3'
          >
            <Button
              className='w-full border-[#7F56D9] bg-[#573DF5] text-base'
              disabled={!isValid}
              type='submit'
            >
              {loginLoading ? <Loader /> : 'Continue'}
            </Button>
            <p className='text-sm font-medium'>Or</p>
            <Button
              className='group w-full gap-[6px] border border-[#D6BBFB] bg-[#FFFFFF] p-[10px] text-base font-semibold text-[#573DF5] hover:bg-[#573DF5] hover:text-white'
              // onClick={handleWalletLogin}
              disabled
            >
              <Wallet03 className='size-5' />
              Connect Wallet
            </Button>
          </div>
          <p className='text-center text-xs leading-[18px] text-[#3B3A40]'>
            Don't have an account?{' '}
            <Link
              className='text-xs font-bold leading-[18px] text-[#6230EC]'
              href='/signup'
            >
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </FormContainer>
  );
};
