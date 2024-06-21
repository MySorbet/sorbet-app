'use client';

import { FormContainer } from '../signin';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { UserSignUpContext, UserSignUpContextType } from './signup-container';
import { useContext, useState } from 'react';

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
      <div className='flex flex-col gap-6 h-full'>
        <div className='flex w-full justify-between items-center'>
          <h1 className='font-semibold text-2xl'>Bio</h1>
          <p className='font-medium text-sm text-[#344054]'>Step 2 of 3</p>
        </div>
        <div className='flex flex-col flex-1 gap-[6px]'>
          <h1 className='text-sm font-medium text-[#344054]'>
            Create a short Bio
          </h1>
          <Textarea
            placeholder='A few words about yourself'
            className='border border-[#D0D5DD] shadow-sm shadow-[#1018280D] h-[154px] focus-visible:ring-transparent '
            onChange={(e) => setBio(e.target.value)}
            defaultValue={userData.bio}
          />
        </div>
        <div className='flex gap-3'>
          <Button
            className='bg-[#FFFFFF] border border-[#D0D5DD] shadow-sm shadow-[#1018280D] text-[#344054]'
            onClick={() => setStep(1)}
          >
            Back
          </Button>
          <Button
            className='w-full text-white bg-[#573DF5] border border-[#7F56D9] shadow-sm shadow-[#1018280D]'
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
