'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { IndividualOrBusiness } from '@/app/signin/components/business/individual-or-business';
import { Spinner } from '@/components/common/spinner';
import { AuthModal, AuthModalMode } from '@/components/auth';
import { Button } from '@/components/ui/button';
import { useAuth, useUpdateUser } from '@/hooks';

/**
 * Two buttons which launch the custom auth modal.
 * Will also allow the user to select individual or business if they have not yet
 */
export const SigninContent = () => {
  const { user, loading } = useAuth();

  // Track which button was pressed to determine modal mode
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>('signup');

  const [showIndividualOrBusiness, setShowIndividualOrBusiness] =
    useState(false);

  // Logged in users who visit signin page will be redirected to the home page
  const router = useRouter();
  useEffect(() => {
    if (user) {
      if (!user.customerType) {
        setShowIndividualOrBusiness(true);
      } else {
        router.push('/');
      }
    }
  }, [user, router]);

  const { mutate: updateUser } = useUpdateUser({ toastOnSuccess: false });

  const handleClick = (mode: AuthModalMode) => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  if (showIndividualOrBusiness) {
    return (
      <IndividualOrBusiness
        onSelect={(type) => {
          if (!user) return; // Can't do anything without a user

          // If user is signing up as a business, update their customer type
          updateUser({
            id: user.id,
            customerType: type,
          });
        }}
      />
    );
  }

  return (
    <>
      <div className='container flex max-w-96 flex-col items-center justify-center gap-14'>
        {/* Logo and title */}
        <div className='flex flex-col items-center justify-center gap-6'>
          <SorbetLogo />
          <h1 className='text-center text-2xl font-semibold'>
            Borderless payment for freelancers and businesses
          </h1>
        </div>

        {/* Buttons */}
        <div className='flex w-full flex-col gap-3'>
          <Button onClick={() => handleClick('signup')} disabled={loading}>
            {loading && authModalMode === 'signup' && <Spinner />} Get started with Sorbet
          </Button>
          <Button
            onClick={() => handleClick('signin')}
            disabled={loading}
            variant='secondary'
          >
            {loading && authModalMode === 'signin' && <Spinner />} Sign in
          </Button>
        </div>
      </div>

      <AuthModal
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
        mode={authModalMode}
      />
    </>
  );
};

/** The most up to date Sorbet logo */
const SorbetLogo = () => {
  return (
    <div className='flex items-center justify-center gap-2'>
      <Image
        src='/svg/social/black-sorbet-logo.svg'
        width={40}
        height={40}
        className='size-10'
        alt='Sorbet'
        priority
      />
      <span className="text-primary font-jura font-bold text-[24.3px] leading-[1.4] tracking-[0]">
        SORBET
      </span>
    </div>
  );
};
