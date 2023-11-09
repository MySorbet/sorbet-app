'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import './signin.css';

import { signInAsync } from '@/app/api/auth';

const Signin = () => {
  const router = useRouter();

  const [loginData, setLoginData] = useState({
    email: '',
    accountId: '',
  });

  const onChange = (e: any) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const loginUser = async () => {
    const res = await signInAsync(loginData);
    // console.log(res.status);
    if (res.data.status == 'success login') {
      router.push('/profile');
    }
  };

  return (
    <div className='flex h-screen flex-col items-center justify-center bg-[#F2F2F2] bg-no-repeat'>
      <div className='w-[500px] items-center justify-center rounded-2xl bg-[#FFFFFF] p-6 pt-4 text-black max-sm:w-[300px]'>
        <div className='mb-3 flex justify-end'>
          <Image src='/images/cancel.png' alt='cancel' width={40} height={40} />
        </div>
        <div className='flex flex-col items-start gap-6 px-6 pb-6'>
          <h1 className='test-[32px]'>Sign in</h1>
          <div className='item w-full'>
            <label className='text-[#595B5A]'>Email</label>
            <input
              className='w-full rounded-lg'
              placeholder='Jon@gmail.com'
              name='email'
              onChange={onChange}
            />
          </div>
          <div className='item w-full'>
            <label className='text-[#595B5A]'>Account ID</label>
            <input
              className='w-full rounded-lg '
              placeholder='Jon_S'
              name='accountId'
              onChange={onChange}
            />
          </div>
          <div className='item w-full'>
            <button
              className='bg-primary-default h-11 gap-1 self-stretch rounded-lg px-2 py-1 text-sm text-white'
              onClick={loginUser}
            >
              continue
            </button>
          </div>
          <div className='inline-block w-full text-base'>
            Already have an account?
            <span
              className='text-primary-default cursor-pointer pl-1'
              onClick={() => router.push('/signup')}
            >
              Sign up
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
