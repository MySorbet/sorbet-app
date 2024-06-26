'use client';

import { BlurredLogos } from '../common';
import { AuthHero } from './auth-hero';
import { SignInForm } from './signin-form';

const SignInContainer = () => {
  return (
    <div className='flex w-screen h-screen items-center justify-center bg-red-900 bg-gradient-to-r from-[#FFFFFF] to-[#D4CEFD]'>
      <div className='fixed -left-[52rem]'>
        <BlurredLogos />
      </div>
      <div className='h-[562px] w-[980px] border border-[#4F38DD] border-opacity-80 rounded-[32px] bg-gradient-to-r from-[#FFFFFFCC] to-[#D4CEFDCC]  p-8 pl-12 flex justify-between z-20'>
        <AuthHero />
        <SignInForm />
      </div>
    </div>
  );
};

export { SignInContainer };
