'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import './signup.css';

import { signUpAsync } from '@/app/api/auth';

const Signup = () => {
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    accountId: '',
  });

  const onChange = (e: any) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });
  };

  const registerUser = async () => {
    // console.log(registerData, 'ss');
    const res = await signUpAsync(registerData);
    // console.log(res);
    if (res.data.id) {
      router.push('/signin');
    }
  };

  const router = useRouter();

  return (
    <div className='flex h-screen flex-col items-center justify-center bg-[#F2F2F2] bg-no-repeat'>
      <div className='w-[500px] max-sm:w-[300px] items-center justify-center rounded-2xl bg-[#FFFFFF] p-6 pt-4 text-black'>
        <div className='mb-3 flex justify-end'>
          <Image src='/images/cancel.png' alt='cancel' width={40} height={40} />
        </div>
        <div className='flex flex-col items-start gap-6 px-6 pb-6'>
          <h1 className='test-[32px]'>Sign up</h1>
          <div className='row'>
            <div className='item'>
              <label className='text-[#595B5A]'>First name</label>
              <input
                className='w-full rounded-lg'
                placeholder='Jon'
                name='firstName'
                value={registerData.firstName}
                onChange={onChange}
              />
            </div>
            <div className='item'>
              <label className='text-[#595B5A]'>Last name</label>
              <input
                className='w-full rounded-lg'
                placeholder='Smith'
                name='lastName'
                value={registerData.lastName}
                onChange={onChange}
              />
            </div>
          </div>
          <div className='item w-full'>
            <label className='text-[#595B5A]'>Email</label>
            <input
              className='w-full rounded-lg'
              placeholder='Jon@gmail.com'
              name='email'
              value={registerData.email}
              onChange={onChange}
            />
          </div>
          <div className='item w-full'>
            <label className='text-[#595B5A]'>Account ID</label>
            <input
              className='w-full rounded-lg '
              placeholder='Jon_S'
              name='accountId'
              value={registerData.accountId}
              onChange={onChange}
            />
          </div>
          <div className='item w-full'>
            <button
              className='h-11 gap-1 self-stretch rounded-lg bg-primary-default px-2 py-1 text-sm text-white'
              onClick={registerUser}
            >
              continue
            </button>
          </div>
          <div className='inline-block w-full text-base'>
            Already have an account?
            <span
              className='cursor-pointer pl-1 text-primary-default'
              onClick={() => router.push('/signin')}
            >
              Sign in
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
