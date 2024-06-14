'use client';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useAuth } from '@/hooks';
import { useLoginWithEmail } from '@/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircleCheck, CircleAlert, Loader } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email({ message: 'Invalid email format' }),
});

const SignInForm = () => {
  const { register, handleSubmit, control } = useForm({
    resolver: zodResolver(schema),
  });
  const { isValidating, isValid, touchedFields } = useFormState({
    control,
  });

  const router = useRouter();
  const { user, accessToken } = useAuth();

  const { isPending: loginLoading, mutateAsync: loginWithEmail } =
    useLoginWithEmail();
  useEffect(() => {
    if (user && accessToken) {
      router.push('/');
    }
  }, [user, router]);

  const onSubmit = handleSubmit(async (data) => {
    await loginWithEmail(data.email);
  });

  return (
    <div
      style={{
        boxShadow: '0px 20px 60px 0px #20202026',
      }}
      className='bg-[#F9F7FF] w-[400px] p-6 rounded-3xl flex flex-col gap-8'
    >
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
              className={
                isValid
                  ? 'flex w-full bg-[#573DF5] text-base font-semibold p-[10px] border border-[#573DF5]'
                  : 'flex w-full font-semibold p-[10px] text-base bg-#F2F4F7] text-[#98A2B3] border border-[#EAECF0]'
              }
              disabled={!isValid}
              type='submit'
            >
              {loginLoading ? <Loader /> : 'Continue'}
            </Button>
            <p className='text-sm font-medium'>Or</p>
            <Button className='bg-[#FFFFFF] border border-[#D6BBFB] text-[#573DF5] w-full gap-[6px] text-base font-semibold p-[10px]'>
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
                />
              </svg>
              Connect Wallet
            </Button>
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
    </div>
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
