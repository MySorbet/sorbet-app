/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';

import Header from '@/components/Header/userHeader';

export default function Notification() {
  return (
    <>
      <div className='p-4'>
        <Header />
      </div>
      <div className='flex h-screen flex-col items-center justify-center bg-[#F2F2F2] bg-no-repeat'>
        <div className='w-[500px] items-center justify-center rounded-2xl bg-[#FFFFFF] p-6 pt-4 text-black'>
          <div className='mb-3 flex justify-end'>
            <img
              src='/svg/signup/cancel.svg'
              alt='cancel'
              width={40}
              height={40}
            />
          </div>
          <div className='flex flex-col items-start gap-6 px-6 pb-6'>
            <div className='text-2xl font-semibold	'>
              Click the link in your email!
            </div>
            <div className='flex flex-col items-start gap-6 text-base	font-normal'>
              <p>
                We just sent an email to jon@gmail.com to verify your Sorbet
                account.
              </p>
              <p>
                If you don’t see an email within 15 minutes, check your spam
                folder or click <span className='underline'>resend email</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
