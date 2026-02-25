import { SigninHeroLayout } from '@/app/signin/components/signin-hero-layout';
import Page from '@/components/common/page';

import { ProfileCompletionContent } from './components/profile-completion-content';

const ProfileCompletionPage = () => {
  return (
    <Page.Main className='h-full items-center justify-center'>
      <SigninHeroLayout className='h-full w-full p-6'>
        <ProfileCompletionContent />
      </SigninHeroLayout>
    </Page.Main>
  );
};

export default ProfileCompletionPage;
