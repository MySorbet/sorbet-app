'use client';

import { BlurredLogos } from '../common';
import { SignUpForm } from './signup-form';
import { Step1 } from './step1';
import { Step2 } from './step2';
import { Step3 } from './step3';
import { AuthHero } from '@/components';

const SignUpContainer = () => {
  return (
    <div className='flex w-screen h-screen items-center justify-center bg-red-900 bg-gradient-to-r from-[#FFFFFF] to-[#D4CEFD]'>
      <div className='fixed -left-[52rem]'>
        <BlurredLogos />
      </div>
      <div className='h-[562px] w-[980px] border border-[#4F38DD] border-opacity-80 rounded-[32px] bg-gradient-to-r from-[#FFFFFFCC] to-[#D4CEFDCC]  p-8 pl-12 flex justify-between z-20'>
        <AuthHero />
        {/* <SignUpForm /> */}
        {/* <Step1 /> */}
        {/* <Step2 /> */}
        <Step3 />
      </div>
    </div>
  );
};

export { SignUpContainer };
