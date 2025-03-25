import Image from 'next/image';

import ShinyButton from '@/components/common/shiny-button';

interface ClaimYourProfileProps {
  handle: string;
  handleClaimMyProfile: () => void;
}

/** Component to display a "Claim your profile CTA when visiting a profile that does not exist" */
export const ClaimYourProfile = ({
  handle,
  handleClaimMyProfile,
}: ClaimYourProfileProps) => {
  return (
    <div className='align-center container mt-40 flex size-full flex-col items-center justify-center gap-10'>
      <div className='fixed -left-36 top-40 -z-10'></div>
      <div>
        <Image src='/svg/logo.svg' alt='logo' width={100} height={100} />
      </div>
      <div>
        <div className='border-1 flex grow-0 justify-center rounded-xl border border-gray-200 bg-gray-100 p-6 text-4xl drop-shadow-xl'>
          <span className='text-gray-500'>mysorbet.io/</span>
          <span>{handle}</span>
        </div>
        <div className='mt-4 text-center text-2xl'>
          This handle is available for you to build your internet presence
          today!
        </div>
      </div>
      <ShinyButton
        text='Claim This Handle'
        onClick={handleClaimMyProfile}
        className='bg-sorbet'
      />
    </div>
  );
};
