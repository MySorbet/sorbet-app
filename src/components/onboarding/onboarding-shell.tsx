'use client';
// TODO: Remove use client and fix trickle down errors

import { FC, PropsWithChildren, ReactNode } from 'react';

import { AuthHero } from './auth-hero';
import { BlurredLogos } from './blurred-logos';

/** Simple aesthetic component which renders a full screen onboarding experience.
 *  - blurred gradient background
 *  - centered hero calling out sorbet's features
 *  - `children` render the signin/signup experience
 */
const OnboardingShell: FC<
  PropsWithChildren<{ renderUnderAuthHero?: () => ReactNode }>
> = ({ children, renderUnderAuthHero }) => {
  return (
    <div className='flex size-full items-center justify-center bg-red-900 bg-gradient-to-r from-[#FFFFFF] to-[#D4CEFD]'>
      <div className='fixed -left-[52rem]'>
        <BlurredLogos className='opacity-60' />
      </div>
      <div className='z-20 flex min-h-[562px] w-[980px] justify-between rounded-[32px] border border-[#4F38DD] border-opacity-80 bg-gradient-to-r from-[#FFFFFFCC] to-[#D4CEFDCC] p-12'>
        <div className='flex flex-col justify-between'>
          <AuthHero />
          {renderUnderAuthHero?.() ?? null}
        </div>
        {children}
      </div>
    </div>
  );
};

export { OnboardingShell };
