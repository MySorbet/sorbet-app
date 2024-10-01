'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

import Confetti, { ConfettiRef } from '@/components/magicui/confetti';
import { useUserSignUp } from '@/components/onboarding/signup/signup';
import { Button } from '@/components/ui/button';

import { FormContainer } from '../form-container';

const AllSet = () => {
  const router = useRouter();
  const { userData } = useUserSignUp();

  // This bit allows us to fire the confetti on mount, overcoming the issue
  // where the confetti would not fire if the component was mounted in the same render cycle
  const confettiRef = useRef<ConfettiRef>(null);
  useEffect(() => {
    const timer = setTimeout(() => {
      confettiRef.current?.fire();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <FormContainer>
      <div className='relative flex h-full flex-col justify-between gap-6'>
        <Confetti
          ref={confettiRef}
          className='pointer-events-none absolute left-0 top-0 z-0 size-full'
        />
        <div className='flex flex-col gap-4'>
          <h1 className='text-2xl font-semibold'>Your profile is ready 🥳</h1>
          <p className='text-sm font-medium text-[#344054]'>
            Go ahead and add links to your socials and portfolios
          </p>
        </div>
        <div
          className='cursor-pointer select-none self-center text-7xl'
          onClick={() => confettiRef.current?.fire()}
          onMouseEnter={() => confettiRef.current?.fire()}
        >
          🎉
        </div>
        <Button
          className='bg-sorbet w-full text-base font-semibold text-white shadow-sm shadow-[#1018280D]'
          onClick={() => router.push(`/${userData.handle}`)}
        >
          Continue to your Profile
        </Button>
      </div>
    </FormContainer>
  );
};

export { AllSet };
