import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { VerifyCard } from './verify-card';

/** Main card for the verification page with a call to action button */
export const AccountVerificationCard = ({
  className,
}: {
  className?: string;
}) => {
  const title = 'Account Verification';
  const handleVerifyAccount = () => {
    console.log('Verify Account');
  };
  return (
    <VerifyCard className={cn('@container w-full', className)}>
      <div className='flex flex-col gap-3'>
        <div className='flex flex-col gap-1.5'>
          <h2 className=' text-wrap break-words text-2xl font-semibold'>
            {title}
          </h2>
          <p className='text-sm'>
            Verify your account to accept payments via ACH/Wire or Credit Card.
          </p>
        </div>

        <Button
          variant='sorbet'
          onClick={handleVerifyAccount}
          className='@xs:max-w-fit w-full'
        >
          Get verified
        </Button>
      </div>
    </VerifyCard>
  );
};
