import { SignInForm } from './signin-form';
import { SignInHero } from './signin-hero';

const SignInContainer = () => {
  return (
    <div className='flex w-screen h-screen items-center justify-center bg-red-900 bg-gradient-to-r from-[#FFFFFF] to-[#D4CEFD]'>
      <div className='h-[562px] w-[980px] border border-[#4F38DD] border-opacity-80 rounded-[32px] bg-gradient-to-r from-[#FFFFFFCC] to-[#D4CEFDCC]  p-8 pl-12 flex justify-between'>
        <SignInHero />
        <SignInForm />
      </div>
    </div>
  );
};

export { SignInContainer };
