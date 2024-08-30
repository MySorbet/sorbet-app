'use client';

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';

import { useAuth } from '@/hooks';

import { AllSet } from './all-set';
import { Step1 } from './step1';
import { Step2 } from './step2';
import { Step3 } from './step3';

type UserSignUp = {
  firstName: string;
  lastName: string;
  handle: string;
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
UserSignUpContext.displayName = 'UserSignUpContext';

const initialUserSignUp: UserSignUp = {
  // useSignUp
  firstName: '',
  lastName: '',
  handle: '',
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
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserSignUp>({
    ...initialUserSignUp,
    handle: user?.handle ?? '', // Pre-populate handle with users pregenerated handle
  });
  const [step, setStep] = useState<number>(1);

  if (!user) throw new Error('User not found');

  return (
    <UserSignUpContext.Provider
      value={{ userData, setUserData, step, setStep }}
    >
      {step == 1 && <Step1 />}
      {step == 2 && <Step2 />}
      {step == 3 && <Step3 />}
      {step == 4 && <AllSet />}
    </UserSignUpContext.Provider>
  );
};

export { SignUp };

/** Use this hook throughout the user sign up experience to get and set user info and step */
export const useUserSignUp = () => {
  const ctx = useContext(UserSignUpContext);
  if (!ctx) {
    throw new Error('useUserSignUp must be used within a UserSignUpContext');
  }
  return ctx;
};
