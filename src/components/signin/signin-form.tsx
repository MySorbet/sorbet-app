'use client';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { FormContainer } from './form-container';
import { Loading } from '@/components/common';
import { useWalletSelector } from '@/components/common/near-wallet/walletSelectorContext';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks';
import { useLoginWithEmail, useGetUserByAccountId } from '@/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { randomBytes } from 'crypto';
import { CircleAlert, CircleCheck, Loader } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email({ message: 'Invalid email format' }),
});

const SignInForm = () => {
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
  const { user, accessToken, loginWithWallet } = useAuth();
  const {
    modal: nearModal,
    selector,
    accountId,
    accounts,
  } = useWalletSelector();

  const { isPending: loginLoading, mutateAsync: loginWithEmail } =
    useLoginWithEmail();

  const {
    isPending: isGetUserAccountLoading,
    mutateAsync: getUserByAccountId,
  } = useGetUserByAccountId();

  const handleSignOut = async () => {
    try {
      const wallet = await selector.wallet();
      await wallet.signOut();
    } catch (err) {
      console.log('Failed to sign out');
      console.error(err);
    }
  };

  useEffect(() => {
    if (user && accessToken) {
      router.push('/');
    }
  }, [user, router]);

  const onSubmit = handleSubmit(async (data) => {
    toast({
      title: 'Try login with wallet',
      description:
        'Email login is not active yet. You can use the Connect Wallet option to login for now.',
    });
  });

  useEffect(() => {
    const checkNearConnection = async () => {
      if (accounts.length > 0) {
        const activeAccount = accountId;
        setActiveNearAccount(activeAccount);

        if (activeAccount) {
          const response = await getUserByAccountId(activeAccount);
          if (response.data === 'failed') {
            setAccountNotFound(true);
            await handleSignOut();
          }
        }
      }
    };

    checkNearConnection();
  }, [selector, accountId]);

  useEffect(() => {
    const handleWalletLogin = async () => {
      const urlHash = window.location.hash;
      if (urlHash) {
        const params = new URLSearchParams(urlHash.substring(1));
        const accountId = params.get('accountId');
        const signature = params.get('signature');
        const publicKey = params.get('publicKey');
        setLoading(true);

        if (accountId && signature && publicKey) {
          const response = await loginWithWallet(accountId);
          if (response.status === 'success') {
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

  const handleWalletLogin = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    const challenge = randomBytes(32);
    const message = 'Login with Sorbet';
    await nearModal.show();

    if (accounts.length > 0) {
      const wallet = await selector.wallet();
      if (wallet) {
        const recipient = await wallet.getAccounts();
        if (recipient.length > 0) {
          await wallet.signMessage({
            message,
            recipient: recipient[0].accountId,
            nonce: challenge,
            callbackUrl: '',
          });
        } else {
          toast({
            title: 'No wallet accounts found',
            description:
              'Please make sure your wallet has accounts and is connected.',
            variant: 'destructive',
          });
        }
      }
    }
  };

  return (
    <FormContainer>
      {isLoading && <Loading />}
      <h1 className='text-2xl font-semibold'>Sign In</h1>
      <form
        onSubmit={onSubmit}
        id='signin-form'
        className='px-0 py-2 gap-4 flex flex-col justify-between flex-1'
      >
        <div className='flex flex-col gap-[6px] h-28 '>
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
              <Loader className='h-4 w-4  absolute right-4 top-3' />
            )}
            {touchedFields.email ? (
              isValid ? (
                <CircleCheck className='h-4 w-4 text-[#079455] absolute right-4 top-3' />
              ) : (
                <CircleAlert className='h-4 w-4 text-[#D92D20] absolute right-4 top-3' />
              )
            ) : null}
          </div>
          {!isValid && touchedFields.email && (
            <p className='text-sm text-red-500'>Invalid email format</p>
          )}
        </div>
        <div className='flex flex-col h-full justify-between'>
          <div
            id='button-container'
            className='flex flex-col gap-3 items-center'
          >
            <Button
              className={'w-full bg-[#573DF5] border-[#7F56D9] text-base'}
              disabled={!isValid}
              type='submit'
            >
              {loginLoading ? <Loader /> : 'Continue'}
            </Button>
            <p className='text-sm font-medium'>Or</p>
            <Button
              className='bg-[#FFFFFF] border border-[#D6BBFB] text-[#573DF5] w-full gap-[6px] text-base font-semibold p-[10px] group hover:bg-[#573DF5] hover:text-white'
              onClick={handleWalletLogin}
            >
              <svg
                width='21'
                height='20'
                viewBox='0 0 21 20'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M14.25 11.6667H14.2583M3 4.16667V15.8333C3 16.7538 3.74619 17.5 4.66667 17.5H16.3333C17.2538 17.5 18 16.7538 18 15.8333V7.5C18 6.57953 17.2538 5.83333 16.3333 5.83333L4.66667 5.83333C3.74619 5.83333 3 5.08714 3 4.16667ZM3 4.16667C3 3.24619 3.74619 2.5 4.66667 2.5H14.6667M14.6667 11.6667C14.6667 11.8968 14.4801 12.0833 14.25 12.0833C14.0199 12.0833 13.8333 11.8968 13.8333 11.6667C13.8333 11.4365 14.0199 11.25 14.25 11.25C14.4801 11.25 14.6667 11.4365 14.6667 11.6667Z'
                  stroke='#573DF5'
                  strokeWidth='1.66667'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className='group-hover:stroke-white'
                />
              </svg>
              {accounts.length > 0 ? 'Sign message to login' : 'Connect Wallet'}
            </Button>
            {accounts.length > 0 && (
              <div>
                Wallet Detected:
                <span className='font-bold text-sorbet'> {accountId}</span>
              </div>
            )}
          </div>
          <p className='text-[#3B3A40] text-xs leading-[18px] text-center'>
            Don't have an account?{' '}
            <Link
              className='text-xs leading-[18px] text-[#6230EC] font-bold'
              href={'/signup'}
            >
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </FormContainer>
  );
};

export { SignInForm };
// box-shadow: 0px 20px 60px 0px #20202026;

/*
<div>
  <p className='text-[#3B3A40] text-xs leading-[18px]'>
    Don't have an account?{' '}
    <strong className='text-xs leading-[18px] text-[#6230EC]'>
      Sign up
    </strong>
  </p>
</div>
*/
