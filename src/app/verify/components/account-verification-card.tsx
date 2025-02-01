import { CircleCheck } from 'lucide-react';

import { PERSONA_URL, TOS_URL } from '@/app/verify/components/urls';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { VerifyStep } from './kyc-checklist';
import { PersonaCard } from './persona-card';
import { TosIframe } from './tos-iframe';
import { VerifyCard } from './verify-card';

/** Main card for the verification page with a call to action button */
export const AccountVerificationCard = ({
  className,
  step,
  onStepChange,
}: {
  className?: string;
  step?: VerifyStep | 'complete';
  onStepChange?: (step: VerifyStep | 'complete') => void;
}) => {
  const isComplete = step === 'complete';

  // Text display is dependent on if verification is complete (or rejected)
  const title = isComplete ? 'Account Verified' : 'Account Verification';
  const description = isComplete
    ? 'Congrats! You can now accept payments via ACH/Wire or Credit Card.'
    : 'Verify your account to accept payments via ACH/Wire or Credit Card.';

  const handleGetVerified = () => {
    // TODO:
    // use useVerify to create a bridge customer
    // Display a loading state for this
    // then when the TOS link comes back, pass it to the TOSIframe
    onStepChange?.('terms');
  };

  // TODO:
  // When the step is "terms", poll the bridge customer to see if the terms have been accepted
  // If they have. set step to details
  // OR we could listen fro this iframe message. Should probs invalidate the query too
  const handleTermsComplete = () => {
    onStepChange?.('details');
  };

  const handleDetailsComplete = () => {
    onStepChange?.('complete');
    // TODO: invalidate the bridge customer query to make sure the details are updated.
    // There could be a small wait time for the webhook to be processed. We may need to go indeterminate here to wait for that while polling
  };

  return (
    <VerifyCard className={cn('@container w-full', className)}>
      <div className='flex flex-col gap-3'>
        <div className='flex flex-col gap-1.5'>
          <h2 className='flex items-center text-wrap break-words text-2xl font-semibold'>
            {isComplete && (
              <CircleCheck
                className='mr-1 inline-block size-6 text-green-500'
                strokeWidth={2}
              />
            )}
            {title}
          </h2>
          <p className='text-sm'>{description}</p>
        </div>

        {/* Step specific content */}
        {!step && (
          <Button
            variant='sorbet'
            onClick={handleGetVerified}
            className='@xs:max-w-fit w-full'
          >
            Get verified
          </Button>
        )}

        {step === 'terms' && (
          <TosIframe url={TOS_URL} onComplete={handleTermsComplete} />
        )}

        {step === 'details' && (
          <>
            {/* Temp button just to advance to the next step*/}
            <Button
              variant='link'
              className='self-start'
              onClick={handleDetailsComplete}
            >
              Skip
            </Button>
            <PersonaCard url={PERSONA_URL} onComplete={handleDetailsComplete} />
          </>
        )}
      </div>
    </VerifyCard>
  );
};
