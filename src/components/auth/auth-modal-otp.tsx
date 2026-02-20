'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import { Spinner } from '@/components/common/spinner';
import { Button } from '@/components/ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';

import { AuthModalStep } from './use-auth-modal-state';

interface AuthModalOtpProps {
  email: string;
  otpError: string;
  step: AuthModalStep;
  onSubmit: (code: string) => void;
  onResend: () => void;
}

/** Mask an email for privacy display, e.g. "test@example.com" -> "t***@e***.com" */
function maskEmail(email: string): string {
  const [localPart, domain] = email.split('@');
  if (!localPart || !domain) return email;

  const maskedLocal =
    localPart.length > 1
      ? localPart[0] + '*'.repeat(Math.min(localPart.length - 1, 3))
      : localPart;

  const domainParts = domain.split('.');
  const domainName = domainParts[0] || '';
  const tld = domainParts.slice(1).join('.');

  const maskedDomain =
    domainName.length > 1
      ? domainName[0] + '*'.repeat(Math.min(domainName.length - 1, 3))
      : domainName;

  return `${maskedLocal}@${maskedDomain}.${tld}`;
}

/** OTP verification step for the auth modal */
export const AuthModalOtp = ({
  email,
  otpError,
  step,
  onSubmit,
  onResend,
}: AuthModalOtpProps) => {
  const [code, setCode] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const hasSubmittedRef = useRef(false);
  const isVerifying = step === 'verifying';
  const maskedEmail = maskEmail(email);

  // Reset code and submitted flag when there's an error
  useEffect(() => {
    if (otpError && step === 'otp') {
      setCode('');
      hasSubmittedRef.current = false;
    }
  }, [otpError, step]);

  // Handle OTP auto-submit when 6 digits are entered
  useEffect(() => {
    if (code.length === 6 && !isVerifying && !hasSubmittedRef.current) {
      hasSubmittedRef.current = true;
      onSubmit(code);
    }
  }, [code, isVerifying, onSubmit]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(
        () => setResendCooldown(resendCooldown - 1),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleResend = () => {
    if (resendCooldown > 0) return;
    setCode('');
    setResendCooldown(30);
    onResend();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length === 6 && !isVerifying && !hasSubmittedRef.current) {
      hasSubmittedRef.current = true;
      onSubmit(code);
    }
  };

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
        <h2 className='mb-1 text-lg font-semibold'>Verify it's you</h2>
        <p className='text-muted-foreground text-sm'>
          Enter the 6-digit code sent to your email {maskedEmail}.
        </p>
      </div>

      {/* OTP Input */}
      <form onSubmit={handleSubmit}>
        <div className='space-y-4'>
          <div className='flex justify-center'>
            <InputOTP
              maxLength={6}
              value={code}
              onChange={setCode}
              disabled={isVerifying}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator className='text-black' />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {otpError && (
            <p className='text-destructive text-center text-sm'>{otpError}</p>
          )}

          <Button
            type='submit'
            disabled={isVerifying || code.length !== 6}
            className='w-full'
          >
            {isVerifying && <Spinner className='mr-2' />}
            Verify & Continue
          </Button>
        </div>
      </form>

      {/* Resend link */}
      <p className='text-muted-foreground mt-6 text-center text-sm'>
        Didn't get an email?{' '}
        <button
          type='button'
          onClick={handleResend}
          disabled={resendCooldown > 0}
          className='text-foreground font-semibold hover:underline disabled:cursor-not-allowed disabled:opacity-50'
        >
          {resendCooldown > 0
            ? `Resend code (${resendCooldown}s)`
            : 'Resend code'}
        </button>
      </p>
    </div>
  );
};
