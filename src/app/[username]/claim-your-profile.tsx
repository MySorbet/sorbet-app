import { Button } from '@/components/ui/button';

interface ClaimYourProfileProps {
  handle: string;
  handleClaimMyProfile: () => void;
}

export const ClaimYourProfile = ({
  handle,
  handleClaimMyProfile,
}: ClaimYourProfileProps) => {
  return (
    <div className='align-center container mt-40 flex size-full flex-col items-center justify-center gap-10'>
      <div>
        <img src='/svg/logo.svg' alt='logo' width={100} height={100} />
      </div>
      <div>
        <div className='border-1 flex grow-0 justify-center rounded-xl border border-gray-200 bg-gray-100 p-6 text-4xl'>
          <span className='text-gray-500'>mysorbet.io/</span>
          <span>{handle}</span>
        </div>
        <div className='mt-4 text-center text-2xl'>
          The handle is available for you to build your internet presence today!
        </div>
      </div>
      <Button
        size='lg'
        className='bg-sorbet hover:bg-sorbet-dark animate-pulse text-xl hover:animate-none'
        onClick={handleClaimMyProfile}
      >
        Claim This Handle
      </Button>
    </div>
  );
};
