'use client';

// import { signInAsync, signInWithWallet, signUpWithWallet } from '@/api/auth';
import './signin.css';
import { signInAsync } from '@/api/auth';
import { Loading } from '@/components/commons';
import { useWalletSelector } from '@/components/commons/near-wallet/walletSelectorContext';
import { config } from '@/lib/config';
// import { LOCAL_KEY, ROLE_KEY } from '@/constant/constant';
// import { useAppDispatch } from '@/redux/hook';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

const Signin = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [isLoading, setLoading] = useState<boolean>(false);
  const searchParams = useSearchParams();

  const { modal: nearModal, accountId, selector } = useWalletSelector();
  const router = useRouter();

  const onSubmit = handleSubmit(async (data) => {
    if (!data.email) {
      return;
    }

    setLoading(true);

    const email = data.email;
    const existingUser = await signInAsync({ email });
    if (!existingUser.data) {
      alert(
        'User account not found, please try again or sign up for an account'
      );
      setLoading(false);
    } else {
      selector
        .wallet('fast-auth-wallet')
        .then((fastAuthWallet: any) => {
          fastAuthWallet.signIn({
            contractId: config.contractId,
            email: data.email,
            accountId: data.username,
            isRecovery: false,
          });
        })
        .then(() => {
          setLoading(false);
        });
    }
  });

  return (
    <div className='flex h-screen flex-col items-center justify-center bg-[#F2F2F2] bg-no-repeat'>
      {isLoading && <Loading />}
      <div className='w-[500px] items-center justify-center rounded-2xl bg-[#FFFFFF] p-6 pt-4 text-black max-sm:w-[300px]'>
        <div className='mb-3 flex justify-end'>
          <img src='/images/cancel.png' alt='cancel' className='h-10 w-10' />
        </div>
        <form onSubmit={onSubmit}>
          <div className='flex flex-col items-start gap-6 px-6 pb-6'>
            <h1 className='text-[32px]'>Sign in</h1>
            <div className='item w-full'>
              <label className='text-[#595B5A]'>Email</label>
              <input
                className='w-full rounded-lg'
                placeholder='your@email.com'
                {...register('email', {
                  required: 'Please enter a valid email address',
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: 'Please enter a valid email address',
                  },
                })}
                onChange={(e) => {
                  setValue('email', e.target.value);
                }}
              />
              {typeof errors.email?.message === 'string' && (
                <p className='text-sm text-red-500'>{errors.email?.message}</p>
              )}
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
                onClick={() => nearModal.show()}
              >
                Connect Wallet
              </button>
            </div>
            <div className='inline-block w-full text-base text-center'>
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
