import Page from '@/components/common/page';

import { SigninContent } from './components/signin-content';
import { SigninHeroLayout } from './components/signin-hero-layout';

const SignInPage = () => {
  return (
    <Page.Main className='h-full items-center justify-center'>
      {/* Note that we skip page content here */}
      <SigninHeroLayout className='h-full w-full p-6'>
        <SigninContent />
      </SigninHeroLayout>
    </Page.Main>
  );
};

export default SignInPage;
