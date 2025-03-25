import { SigninContent } from '@/app/signin/components/signin-content';
import Page from '@/components/common/page';

const SignInPage = () => {
  return (
    <Page.Main className='h-full items-center justify-center'>
      {/* Note that we skip page content here */}
      <SigninContent />
    </Page.Main>
  );
};

export default SignInPage;
