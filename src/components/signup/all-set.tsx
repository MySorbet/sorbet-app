'use client';

import { FormContainer } from '../signin';
import { Button } from '../ui/button';
import { PasteLinkDemo } from './paste-link-demo';
import { SocialsDemo } from './socials-demo';
import { WidgetResizeDemo } from './widget-resize-demo';
import { useRouter } from 'next/navigation';

const AllSet = () => {
  const router = useRouter();

  return (
    <FormContainer>
      <div className='flex flex-col gap-6 h-full'>
        <h1 className='font-semibold text-2xl'>Your profile is ready 🎉</h1>
        <div className='flex flex-col bg-[#F0EBF9] h-full py-4 px-3 rounded-xl gap-4'>
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
          className='w-full text-white bg-[#573DF5] border border-[#7F56D9] shadow-sm shadow-[#1018280D] font-semibold text-base'
          onClick={() => router.push('/daniel')}
        >
          Edit My Profile
        </Button>
      </div>
    </FormContainer>
  );
};

export { AllSet };
