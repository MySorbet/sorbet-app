'use client';

import { FormContainer } from '../signin';
import { Button } from '../ui/button';
import { PasteLinkDemo } from './paste-link-demo';
import { UserSignUpContext, UserSignUpContextType } from './signup-container';
import { SocialsDemo } from './socials-demo';
import { WidgetResizeDemo } from './widget-resize-demo';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';

const AllSet = () => {
  const { userData } = useContext(UserSignUpContext) as UserSignUpContextType;
  const router = useRouter();

  return (
    <FormContainer>
      <div className='flex flex-col gap-6 h-full'>
        <h1 className='font-semibold text-2xl'>All set!</h1>
        <div className='flex flex-col bg-[#F0EBF9] h-full py-4 px-3 rounded-xl gap-4'>
          <p className='text-sm font-medium text-[#344054]'>
            Your profile is ready. Start by adding widgets using the input at
            the bottom of the viewport.
          </p>
          <PasteLinkDemo />
          <p className='text-sm font-medium text-[#344054]'>
            Paste links from any of the following
          </p>
          <SocialsDemo />
          <p className='text-sm font-medium text-[#344054]'>
            Once added you can change the size by hovering over a widget and
            selecting from the control
          </p>
          <WidgetResizeDemo />
        </div>
        <Button
          className='w-full text-white bg-[#573DF5] border border-[#7F56D9] shadow-sm shadow-[#1018280D] font-semibold text-base'
          onClick={() => router.push('/')}
        >
          Edit My Profile
        </Button>
      </div>
    </FormContainer>
  );
};

export { AllSet };
