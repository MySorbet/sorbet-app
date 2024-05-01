'use client';

import './signin.css';
import { Loading } from '@/components/common';
import { useWalletSelector } from '@/components/common/near-wallet/walletSelectorContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

const Signin = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [isLoading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { user, loginWithEmail, accessToken } = useAuth();

  useEffect(() => {
    if (user && accessToken) {
      router.push('/');
    }
  }, [user, router]);

  const onSubmit = handleSubmit(async (data) => {
    if (!data.email) {
      return;
    }

    setLoading(true);

    const loginMessage = await loginWithEmail(data.email);
    if (loginMessage !== 'Login successful') {
      alert(loginMessage);
      setLoading(false);
    } else {
      setLoading(false);
      router?.push('/');
    }
  });

  return (
    <div className='flex h-screen flex-col items-center justify-center bg-[#F2F2F2] bg-no-repeat'>
      {isLoading && <Loading />}
      <div className='w-[500px] items-center justify-center rounded-2xl bg-[#FFFFFF] p-6 px-6 text-black max-sm:w-[300px]'>
        <form onSubmit={onSubmit}>
          <div className='flex flex-col items-start gap-6 px-6 pb-6'>
            <h1 className='text-[32px]'>Sign in</h1>
            <div className='item w-full'>
              <label className='text-[#595B5A]'>Email</label>
              <Input
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
              <Button
                type='submit'
                className='bg-sorbet h-11 gap-1 self-stretch rounded-lg px-2 py-1 text-sm'
              >
                Login with Email
              </Button>
              {/* <Button
                className='h-11 gap-1 self-stretch rounded-lg bg-[#22252a] px-2 py-1 text-sm text-white'
                onClick={() => nearModal.show()}
              >
                Connect Wallet
              </Button> */}
            </div>
            <div className='inline-block w-full text-base text-center'>
              Already have an account?
              <span
                className='text-sorbet cursor-pointer pl-1 font-semibold'
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
