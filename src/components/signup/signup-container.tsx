'use client';

import { BlurredLogos } from '../common';
import { AllSet } from './all-set';
import { SignUpForm } from './signup-form';
import { Step1 } from './step1';
import { Step2 } from './step2';
import { Step3 } from './step3';
import { AuthHero } from '@/components';
import { createContext, Dispatch, SetStateAction, useState } from 'react';

type UserSignUp = {
  email: string;
  firstName: string;
  lastName: string;
  accountId: string;
  image: string | undefined;
  file: File | undefined;
  location: string;
  bio: string;
  skills: string[];
};

export type UserSignUpContextType = {
  userData: UserSignUp;
  setUserData: Dispatch<SetStateAction<UserSignUp>>;
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
};

export const UserSignUpContext = createContext<UserSignUpContextType | null>(
  null
);

const SignUpContainer = () => {
  const [userData, setUserData] = useState<UserSignUp>({
    // useSignUpAsync
    firstName: '',
    lastName: '',
    email: '',
    accountId: '',
    // useUploadProfileImageAsync
    image: '',
    file: undefined,
    // useUpdateUser
    location: '',
    bio: '',
    skills: [],
  });
  const [step, setStep] = useState<number>(0);
  return (
    <div className='flex w-screen h-screen items-center justify-center bg-red-900 bg-gradient-to-r from-[#FFFFFF] to-[#D4CEFD]'>
      <div className='fixed -left-[52rem]'>
        <BlurredLogos />
      </div>
      <div className='h-[562px] w-[980px] border border-[#4F38DD] border-opacity-80 rounded-[32px] bg-gradient-to-r from-[#FFFFFFCC] to-[#D4CEFDCC]  p-8 pl-12 flex justify-between z-20'>
        <AuthHero />
        <UserSignUpContext.Provider
          value={{ userData, setUserData, step, setStep }}
        >
          {step == 0 && <SignUpForm />}
          {step == 1 && <Step1 />}
          {step == 2 && <Step2 />}
          {step == 3 && <Step3 />}
          {step == 4 && <AllSet />}
        </UserSignUpContext.Provider>
      </div>
    </div>
  );
};

export { SignUpContainer };
