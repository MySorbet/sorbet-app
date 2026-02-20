'use client';

import Image from 'next/image';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface AuthModalWaitlistProps {
  message: string;
  onGoBack: () => void;
}

/** Waitlist confirmation view for the auth modal */
export const AuthModalWaitlist = ({
  message,
  onGoBack,
}: AuthModalWaitlistProps) => {
  return (
    <div className='flex flex-col'>
      {/* Header with logo */}
      <div className='mb-6 flex items-center gap-2'>
        <Image
          src='/svg/social/black-sorbet-logo.svg'
          width={32}
          height={32}
          className='size-8'
          alt='Sorbet'
          priority
        />
        <span className='text-primary font-jura text-[24.3px] font-bold leading-[1.4] tracking-[0]'>
          SORBET
        </span>
      </div>

      {/* Success message */}
      <Alert className='mb-6 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950'>
        <AlertTitle className='text-green-800 dark:text-green-200'>
          You're on the waitlist! 🎉
        </AlertTitle>
        <AlertDescription className='text-green-700 dark:text-green-300'>
          {message ||
            "Your email is secured on our waitlist. We'll notify you the moment we're live again."}
        </AlertDescription>
      </Alert>

      {/* Go back button */}
      <Button onClick={onGoBack} className='w-full'>
        Go back
      </Button>
    </div>
  );
};
