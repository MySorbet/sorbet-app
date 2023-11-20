/* eslint-disable @next/next/no-img-element */
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import './signin.css';

import { useWalletSelector } from '@/components/commons/near-wallet/WalletSelectorContext';

import { signInAsync, signInWithWallet, signUpWithWallet } from '@/api/auth';
import { LOCAL_KEY } from '@/constant/constant';
import { useAppDispatch } from '@/redux/hook';
import { updateUserData } from '@/redux/userSlice';

const Signin = () => {
  const dispatch = useAppDispatch();

  const router = useRouter();
  const { modal: nearModal, accountId } = useWalletSelector();

  const [loginData, setLoginData] = useState({
    email: '',
  });

  useEffect(() => {
    const onSuccess = (user: any) => {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(user));
      dispatch(updateUserData(user));
      router.push('/profile');
    };
    const check = async () => {
      if (accountId) {
        const res = await signInWithWallet(accountId);
        if (res.status === 'success') {
          onSuccess(res.data.user);
        } else {
          const res = await signUpWithWallet(accountId, null, null);
          if (res.status === 'success') {
            onSuccess(res.data);
          }
        }
      }
    };
    check();
  }, [accountId]);

  const onChange = (e: any) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const loginUser = async () => {
    const res = await signInAsync(loginData);
    if (res.data.user) {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(res.data.user));
      router?.push(`/profile`);
      dispatch(updateUserData(res.data.user));
    }
  };

  const onModal = async () => {
    nearModal.show();
  };

  return (
    <div className='flex h-screen flex-col items-center justify-center bg-[#F2F2F2] bg-no-repeat'>
      <div className='w-[500px] items-center justify-center rounded-2xl bg-[#FFFFFF] p-6 pt-4 text-black max-sm:w-[300px]'>
        <div className='mb-3 flex justify-end'>
          <img src='/images/cancel.png' alt='cancel' className='h-10 w-10' />
        </div>
        <div className='flex flex-col items-start gap-6 px-6 pb-6'>
          <h1 className='text-[32px]'>Sign in</h1>
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
            <button
              className='bg-primary-default h-11 gap-1 self-stretch rounded-lg px-2 py-1 text-sm text-white'
              onClick={loginUser}
            >
              Continue
            </button>
            <button
              className='h-11 gap-1 self-stretch rounded-lg bg-[#22252a] px-2 py-1 text-sm text-white'
              onClick={() => onModal()}
            >
              Connect Wallet
            </button>
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
      </div>
    </div>
  );
};

export default Signin;
