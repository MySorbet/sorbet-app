'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { IndividualOrBusiness } from '@/app/signin/components/business/individual-or-business';
import { HearAboutUs } from '@/app/signin/components/business/heard-about-us';
import { Spinner } from '@/components/common/spinner';
import { AuthModal, AuthModalMode } from '@/components/auth';
import { Button } from '@/components/ui/button';
import { useAuth, useUpdateUser } from '@/hooks';

type OnboardingStep = 'type-selection' | 'hear-about-us';

interface PendingUserData {
  customerType: 'individual' | 'business';
  fullName?: string;
  companyName?: string;
  country: string;
  phoneNumber?: string;
  companyWebsite?: string;
}

/**
 * Two buttons which launch the custom auth modal.
 * Will also allow the user to select individual or business if they have not yet,
 * followed by a "where did you hear about us" survey
 */
export const SigninContent = () => {
  const { user, loading } = useAuth();

  // Track which button was pressed to determine modal mode
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>('signup');

  // Multi-step onboarding state
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep | null>(
    null
  );
  const [pendingUserData, setPendingUserData] =
    useState<PendingUserData | null>(null);

  // Logged in users who visit signin page will be redirected to the home page
  const router = useRouter();
  useEffect(() => {
    if (user) {
      if (!user.customerType) {
        setOnboardingStep('type-selection');
      } else {
        router.push('/');
      }
    }
  }, [user, router]);

  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser({
    toastOnSuccess: false,
  });

  const handleTypeFormSubmit = (data: PendingUserData) => {
    // Store the form data and move to next step
    setPendingUserData(data);
    setOnboardingStep('hear-about-us');
  };

  const handleHearAboutUsSubmit = (selection: string | null) => {
    if (!user || !pendingUserData) return;

    // Combine all data and update user
    // Map fullName to firstName/lastName if provided
    const nameParts = pendingUserData.fullName?.split(' ') || [];
    const firstName = nameParts[0] || undefined;
    const lastName = nameParts.slice(1).join(' ') || undefined;

    updateUser({
      id: user.id,
      customerType: pendingUserData.customerType,
      firstName: firstName,
      lastName: lastName,
      country: pendingUserData.country,
      phoneNumber: pendingUserData.phoneNumber,
      companyWebsite: pendingUserData.companyWebsite,
      heardAboutUs: selection || undefined,
    });
  };

  const handleClick = (mode: AuthModalMode) => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  // Show "Where did you hear about us?" step
  if (onboardingStep === 'hear-about-us') {
    return (
      <div className='container flex max-w-lg flex-col items-center justify-center'>
        <HearAboutUs onSubmit={handleHearAboutUsSubmit} isLoading={isUpdating} />
      </div>
    );
  }

  // Show Individual/Business selection with inline form
  if (onboardingStep === 'type-selection') {
    return (
      <IndividualOrBusiness
        onSubmit={handleTypeFormSubmit}
        isLoading={isUpdating}
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
