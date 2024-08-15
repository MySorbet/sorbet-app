'use client';

import { useContext, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

import { FormContainer } from '../form-container';
import { UserSignUpContext, UserSignUpContextType } from './signup';

const Step2 = () => {
  const { setUserData, setStep, userData } = useContext(
    UserSignUpContext
  ) as UserSignUpContextType;
  const [bio, setBio] = useState<string>('');

  const handleNext = () => {
    setUserData((prev) => ({ ...prev, bio }));
    setStep(3);
  };

  return (
    <FormContainer>
      <div className='flex h-full flex-col gap-6'>
        <div className='flex w-full items-center justify-between'>
          <h1 className='text-2xl font-semibold'>Bio</h1>
          <p className='text-sm font-medium text-[#344054]'>Step 2 of 3</p>
        </div>
        <div className='flex flex-1 flex-col gap-[6px]'>
          <h1 className='text-sm font-medium text-[#344054]'>
            Create a short Bio
          </h1>
          <Textarea
            placeholder='A few words about yourself'
            className='h-[154px] border border-[#D0D5DD] shadow-sm shadow-[#1018280D] focus-visible:ring-transparent '
            onChange={(e) => setBio(e.target.value)}
            defaultValue={userData.bio}
          />
        </div>
        <div className='flex gap-3'>
          <Button
            className='border border-[#D0D5DD] bg-[#FFFFFF] text-[#344054] shadow-sm shadow-[#1018280D]'
            onClick={() => setStep(1)}
          >
            Back
          </Button>
          <Button
            className='w-full border border-[#7F56D9] bg-[#573DF5] text-white shadow-sm shadow-[#1018280D]'
            onClick={handleNext}
          >
            Next
          </Button>
        </div>
      </div>
    </FormContainer>
  );
};

export { Step2 };