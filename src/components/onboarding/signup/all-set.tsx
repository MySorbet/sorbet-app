'use client';

import { useRouter } from 'next/navigation';

import { useUserSignUp } from '@/components/onboarding/signup/signup';
import { Button } from '@/components/ui/button';

import { FormContainer } from '../form-container';
import { PasteLinkDemo } from './paste-link-demo';
import { SocialsDemo } from './socials-demo';
import { WidgetResizeDemo } from './widget-resize-demo';

const AllSet = () => {
  const router = useRouter();
  const { userData } = useUserSignUp();

  return (
    <FormContainer>
      <div className='flex h-full flex-col gap-6'>
        <h1 className='text-2xl font-semibold'>Your profile is ready 🎉</h1>
        <div className='flex h-full flex-col gap-4 rounded-xl bg-[#F0EBF9] px-3 py-4'>
          <p className='text-sm font-medium text-[#344054]'>
            Start by adding widgets using the textbox at the bottom of the page
          </p>
          <PasteLinkDemo />
          <p className='text-sm font-medium text-[#344054]'>
            Paste links from any of the following
          </p>
          <SocialsDemo />
          <p className='text-sm font-medium text-[#344054]'>
            You can change the size by hovering over a widget and selecting a
            new size
          </p>
          <WidgetResizeDemo />
        </div>
        <Button
          className='w-full border border-[#7F56D9] bg-[#573DF5] text-base font-semibold text-white shadow-sm shadow-[#1018280D]'
          onClick={() => router.push(`/${userData.handle}`)}
        >
          Edit My Profile
        </Button>
      </div>
    </FormContainer>
  );
};

export { AllSet };
