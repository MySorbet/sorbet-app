'use client'; // TODO: Remove use client and fix trickle down errors

import { SigninContent } from '@/app/signin/components/signin-content';

const SignInPage = () => {
  return (
    <div className='bg-background flex size-full items-center justify-center'>
      <SigninContent />
    </div>
  );
};

export default SignInPage;
