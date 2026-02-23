'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { Spinner } from '@/components/common/spinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { AuthModalMode, AuthModalStep } from './use-auth-modal-state';

/** Email validation regex - matches common email patterns */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface AuthModalEmailProps {
  mode: AuthModalMode;
  email: string;
  emailError: string;
  step: AuthModalStep;
  onEmailChange: (email: string) => void;
  onSubmit: (email: string) => void;
}

const COPY = {
  signup: {
    title: "Let's get you started",
    subtitle: 'Set up your account in under a minute',
  },
  signin: {
    title: 'Hey, welcome back 👋',
    subtitle: 'Access your workspace.',
  },
} as const;

/** Email input step for the auth modal */
export const AuthModalEmail = ({
  mode,
  email,
  emailError,
  step,
  onEmailChange,
  onSubmit,
}: AuthModalEmailProps) => {
  const [localError, setLocalError] = useState('');
  const isLoading = step === 'checking-access' || step === 'sending-code';
  const copy = COPY[mode];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    // Validate email format
    if (!email.trim()) {
      setLocalError('Email is required');
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      setLocalError("Looks like there's a typo in the email.");
      return;
    }

    onSubmit(email);
  };

  const displayError = emailError || localError;
  const hasError = Boolean(displayError);

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

      {/* Title and subtitle */}
      <div className='mb-6'>
        <h2 className='mb-1 text-lg font-semibold'>{copy.title}</h2>
        <p className='text-muted-foreground text-sm'>{copy.subtitle}</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate>
        <div className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              type='email'
              placeholder='e.g johnsnow@xyz.com'
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              disabled={isLoading}
              autoFocus
              autoComplete='email'
              className={
                hasError ? 'border-destructive focus:ring-destructive' : ''
              }
            />
            {hasError && (
              <p className='text-destructive text-sm'>{displayError}</p>
            )}
          </div>

          <Button
            type='submit'
            disabled={isLoading || !email.trim()}
            className='w-full'
          >
            {isLoading && <Spinner className='mr-2' />}
            Continue
          </Button>
        </div>
      </form>

      {/* Terms footer */}
      <p className='text-muted-foreground mt-6 text-center text-xs'>
        By clicking continue, you agree to our{' '}
        <Link
          href='https://docs.mysorbet.xyz/sorbet/readme/list-of-supported-countries'
          target='_blank'
          rel='noopener noreferrer'
          className='hover:text-foreground underline'
        >
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link
          href='https://docs.mysorbet.xyz/sorbet/legal/privacy-policy'
          target='_blank'
          rel='noopener noreferrer'
          className='hover:text-foreground underline'
        >
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
};
