'use client';
// TODO: Remove use client and fix trickle down errors

import { FC, PropsWithChildren } from 'react';

import { AuthHero } from './auth-hero';
import { BlurredLogos } from './blurred-logos';

/** Simple aesthetic component which renders a full screen onboarding experience.
 *  - blurred gradient background
 *  - centered hero calling out sorbet's features
 *  - `children` render the signin/signup experience
 */
const OnboardingShell: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className='flex h-screen w-screen items-center justify-center bg-red-900 bg-gradient-to-r from-[#FFFFFF] to-[#D4CEFD]'>
      <div className='fixed -left-[52rem]'>
        <BlurredLogos />
      </div>
      <div className='z-20 flex h-[562px] w-[980px] justify-between rounded-[32px] border border-[#4F38DD] border-opacity-80  bg-gradient-to-r from-[#FFFFFFCC] to-[#D4CEFDCC] p-8 pl-12'>
        <AuthHero />
        {children}
      </div>
    </div>
  );
};

export { OnboardingShell };
