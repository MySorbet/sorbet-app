'use client';

import { createContext, Dispatch, SetStateAction, useState } from 'react';

import { AllSet } from './all-set';
import { SignUpForm } from './signup-form';
import { Step1 } from './step1';
import { Step2 } from './step2';
import { Step3 } from './step3';

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

const initialUserSignUp: UserSignUp = {
  // useSignUp
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
};

/** Component hosting all 4 steps of the signup experience. Facilitates moving though steps via context. */
const SignUp = () => {
  const [userData, setUserData] = useState<UserSignUp>(initialUserSignUp);
  const [step, setStep] = useState<number>(3);
  return (
    <UserSignUpContext.Provider
      value={{ userData, setUserData, step, setStep }}
    >
      {step == 0 && <SignUpForm />}
      {step == 1 && <Step1 />}
      {step == 2 && <Step2 />}
      {step == 3 && <Step3 />}
      {step == 4 && <AllSet />}
    </UserSignUpContext.Provider>
  );
};

export { SignUp };
