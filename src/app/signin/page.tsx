/* eslint-disable @next/next/no-img-element */
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import './signin.css';

import { useWalletSelector } from '@/components/commons/near-wallet/walletSelectorContext';

import { useAuthStore } from '@/stores/auth';

import { signInAsync, signInWithWallet, signUpWithWallet } from '@/api/auth';
import { LOCAL_KEY, ROLE_KEY } from '@/constant/constant';
import { useSignInRedirect } from '@/hooks/useSignInRedirect';
import { useAppDispatch } from '@/redux/hook';

const Signin = () => {
  const { register, handleSubmit, setValue } = useForm();
  const searchParams = useSearchParams();

  const { modal: nearModal, accountId } = useWalletSelector();

  const requestSignInWithWallet = useAuthStore(
    (store) => store.requestSignInWithWallet
  );

  const signedIn = useAuthStore((store) => store.signedIn);
  const vmNear = useAuthStore((store) => store.vmNear);
  const { redirect } = useSignInRedirect();

  const router = useRouter();

  useEffect(() => {
    if (signedIn) {
      redirect();
    }
  }, [redirect, signedIn]);

  useEffect(() => {
    if (
      vmNear?.selector &&
      searchParams.get('account_id') &&
      searchParams.get('public_key')
    ) {
      vmNear.selector
        .then((selector: any) => {
          const walletSelectorState = selector.store.getState();

          if (walletSelectorState.selectedWalletId === 'fast-auth-wallet') {
            return selector.wallet('fast-auth-wallet');
          }
        })
        .then((fastAuthWallet: any) => {
          if (fastAuthWallet) {
            fastAuthWallet.signIn({
              contractId: vmNear.config.contractName,
            });
          }
        });
    }
  }, [searchParams, vmNear]);

  const onSubmit = handleSubmit(async (data) => {
    if (!data.email || !vmNear) return;

    vmNear.selector
      .then((selector: any) => selector.wallet('fast-auth-wallet'))
      .then((fastAuthWallet: any) =>
        fastAuthWallet.signIn({
          contractId: vmNear.config.contractName,
          email: data.email,
          isRecovery: true,
        })
      );
  });

  return (
    <div className='flex h-screen flex-col items-center justify-center bg-[#F2F2F2] bg-no-repeat'>
      <div className='w-[500px] items-center justify-center rounded-2xl bg-[#FFFFFF] p-6 pt-4 text-black max-sm:w-[300px]'>
        <div className='mb-3 flex justify-end'>
          <img src='/images/cancel.png' alt='cancel' className='h-10 w-10' />
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='flex flex-col items-start gap-6 px-6 pb-6'>
            <h1 className='text-[32px]'>Sign in</h1>
            <div className='item w-full'>
              <label className='text-[#595B5A]'>Email</label>
              <input
                className='w-full rounded-lg'
                placeholder='Jon@gmail.com'
                name='email'
                {...register('email', {
                  required: 'Please enter a valid email address',
                })}
                onChange={(e) => {
                  setValue('email', e.target.value);
                }}
              />
            </div>
            <div className='item w-full'>
              <button
                type='submit'
                className='bg-primary-default h-11 gap-1 self-stretch rounded-lg px-2 py-1 text-sm text-white'
              >
                Continue
              </button>
              <button
                className='h-11 gap-1 self-stretch rounded-lg bg-[#22252a] px-2 py-1 text-sm text-white'
                onClick={requestSignInWithWallet}
              >
                Connect Wallet
              </button>
            </div>
            <div className='flex w-full items-center justify-start gap-3'>
              <input type='checkbox' id='checkbox' />
              <label htmlFor='checkbox'>As signin with Client </label>
            </div>
            <div className='inline-block w-full text-base'>
              Already have an account?
              <span
                className='text-primary-default cursor-pointer pl-1 font-semibold'
                onClick={() => router.push('/signup')}
              >
                Sign up
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signin;
