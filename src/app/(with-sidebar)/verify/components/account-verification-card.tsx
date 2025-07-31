import { useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, CircleCheck, Hourglass, User } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { useClaimVirtualAccount } from '@/app/(with-sidebar)/accounts/hooks/use-claim-virtual-account';
import { Spinner } from '@/components/common/spinner';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useBridgeCustomer } from '@/hooks/profile/use-bridge-customer';
import { useScopedLocalStorage } from '@/hooks/use-scoped-local-storage';
import { cn, sleep } from '@/lib/utils';

import { useConfettiCannons } from '../hooks/use-confetti-cannons';
import { PersonaCard } from './persona-card';
import { TosIframe } from './tos-iframe';
import { VerifyCard } from './verify-card';
import { AllSteps } from './verify-dashboard';

/** Main card for the verification page with a call to action button */
export const AccountVerificationCard = ({
  className,
  step,
  onStepComplete,
  onCallToActionClick,
  isLoading,
  tosLink,
  kycLink,
  isIndeterminate,
  rejectionReasons,
  isUnderReview,
  isAwaitingUBO,
  isRejected,
}: {
  className?: string;
  step: AllSteps;
  onStepComplete?: (step: AllSteps) => void;
  onCallToActionClick?: (type: 'retry' | 'create-invoice') => void;
  isLoading?: boolean;
  tosLink?: string;
  kycLink?: string;
  isIndeterminate?: boolean;
  rejectionReasons?: string[];
  isUnderReview?: boolean;
  isAwaitingUBO?: boolean;
  isRejected?: boolean;
}) => {
  const isComplete = step === 'complete' && !isRejected && !isUnderReview;

  const queryClient = useQueryClient();
  const { data: customer } = useBridgeCustomer();

  const { mutate: claimVirtualAccount, isPending: isClaiming } =
    useClaimVirtualAccount('usd', {
      onSuccess: () => {
        console.log('Successfully created bridge customer');
        queryClient.invalidateQueries({ queryKey: ['bridgeCustomer'] });
        onStepComplete?.('begin');
      },
      onError: (error) => {
        const message = `Error creating bridge customer: ${error.message}`;
        console.error(message);
        toast.error(message);
      },
    });

  // We consider this loading while the api call is pending, or it has returned and we are waiting for the bridge customer.created event (which happens slightly after kyc links are created)
  const isClaimingAccount = isClaiming || (customer && !customer.customer);

  // This is only callable when there is no bridge customer
  // Success callback will complete this step
  // Error will toast and remain on this step
  const handleGetVerified = () => {
    claimVirtualAccount();
  };

  // When bridge frame fires complete event, invalidate the bridge customer query and advance to the next step
  const handleTermsComplete = async () => {
    await sleep(1000); // Wait 1 second to avoid flashing a confirmation message and give bridge time to update the customer
    queryClient.invalidateQueries({ queryKey: ['bridgeCustomer'] });
    onStepComplete?.('terms');
  };

  // There will be a small wait time for a KYC status transition (to either review, approved, or rejected)
  // Just notify the parent (which will handle going indeterminate)
  const handleDetailsComplete = () => {
    console.log('Details complete');
    onStepComplete?.('details');
  };

  // Confetti on complete
  const [hasFired, setHasFired] = useScopedLocalStorage(
    'verification-confetti-fired',
    false
  );
  const { fire } = useConfettiCannons();
  useEffect(() => {
    if (isComplete && !hasFired) {
      fire();
      setHasFired(true);
    }
  }, [fire, isComplete, hasFired, setHasFired]);

  // Loading skeleton of the initial state
  if (isLoading) {
    return (
      <VerifyCard className={cn('w-full', className)}>
        <div className='flex flex-col gap-3'>
          <div className='flex flex-col gap-1.5'>
            <Skeleton className='h-8 w-60' />
            <Skeleton className='h-4 w-80' />
          </div>
          <Skeleton className='h-11 w-28' />
        </div>
      </VerifyCard>
    );
  }

  return (
    <VerifyCard className={cn('@container w-full', className)}>
      <div className='flex flex-col gap-3'>
        {isIndeterminate && <IndeterminateContent />}
        {isComplete && <CompleteContent />}
        {isRejected && <RejectedContent rejectionReason={rejectionReasons} />}
        {isUnderReview && <UnderReviewContent />}
        {isAwaitingUBO && <AwaitingUBOContent />}
        {!isIndeterminate &&
          !isComplete &&
          !isRejected &&
          !isUnderReview &&
          !isAwaitingUBO && <DefaultContent />}

        {/* Step specific content */}
        {step === 'begin' && (
          <Button
            variant='sorbet'
            onClick={handleGetVerified}
            disabled={isClaimingAccount}
            className='@xs:max-w-fit w-full'
          >
            {isClaimingAccount && <Spinner />}
            Get verified
          </Button>
        )}

        {tosLink && step === 'terms' && (
          <TosIframe
            url={tosLink}
            onComplete={handleTermsComplete}
            className='self-center'
          />
        )}

        {kycLink && !isIndeterminate && step === 'details' && (
          <PersonaCard
            url={kycLink}
            onComplete={handleDetailsComplete}
            className='self-center'
          />
        )}

        {isComplete && (
          <Button
            variant='sorbet'
            onClick={() => onCallToActionClick?.('create-invoice')}
            className='@xs:max-w-fit w-full'
          >
            Create an invoice
          </Button>
        )}

        {isRejected && (
          <Button
            variant='sorbet'
            onClick={() => onCallToActionClick?.('retry')}
            className='@xs:max-w-fit w-full'
          >
            Try again
          </Button>
        )}
      </div>
    </VerifyCard>
  );
};

/** Local component for displaying the card title and description */
const CardContent = ({
  title,
  icon,
  description,
}: {
  title: string;
  icon?: () => React.ReactNode;
  description: React.ReactNode;
}) => {
  return (
    <div className='flex flex-col gap-1.5'>
      <h2 className='flex items-center text-wrap break-words text-2xl font-semibold'>
        {icon?.()}
        {title}
      </h2>
      <p className='text-sm'>{description}</p>
    </div>
  );
};

/** Local component specializing the card content for the indeterminate state */
const IndeterminateContent = () => {
  return (
    <CardContent
      title='Verification pending'
      description="KYC verification is currently pending. Please check back shortly, or
        we'll notify you via email!"
      icon={() => <Spinner className='mr-1.5 size-6' />}
    />
  );
};

/** Local component specializing the card content for the complete state */
const CompleteContent = () => {
  const { fire } = useConfettiCannons();
  return (
    <CardContent
      title='Account verified'
      description={
        <span>
          Congrats! You can now accept payments via ACH or Wire{' '}
          <span
            onMouseOver={fire}
            className='inline-block cursor-pointer transition-transform hover:rotate-6 hover:scale-110'
          >
            🎉
          </span>{' '}
          Try sending an invoice to test it out.
        </span>
      }
      icon={() => (
        <CircleCheck
          className='mr-1.5 inline-block size-6 text-green-500'
          strokeWidth={2}
        />
      )}
    />
  );
};

/** Local component specializing the card content for the default state */
const DefaultContent = () => {
  return (
    <CardContent
      title='Account verification'
      description='Verify your account to accept payments via ACH or Wire.'
    />
  );
};

/** Local component specializing the card content for the under review state */
const UnderReviewContent = () => {
  return (
    <CardContent
      title='Account under review'
      description="Your account is currently under review and will be finalized within 24 hours. We'll notify you via email when it's ready."
      icon={() => (
        <Hourglass className='mr-1.5 inline-block size-6 text-orange-500' />
      )}
    />
  );
};

/** Local component specializing the card content for the awaiting UBO state */
const AwaitingUBOContent = () => {
  return (
    <CardContent
      title='Waiting on UBOs'
      description='The UBOs (ultimate beneficial owners) of your business received an email to verify their identity. Please check your email for the link.'
      icon={() => (
        <User className='mr-1.5 inline-block size-6 text-orange-500' />
      )}
    />
  );
};

const RejectedContent = ({
  rejectionReason,
}: {
  rejectionReason?: string[];
}) => {
  const desc = rejectionReason ? (
    rejectionReason?.length === 1 ? (
      rejectionReason[0]
    ) : (
      <ol className='list-inside list-decimal'>
        {rejectionReason.map((reason, index) => (
          <li key={index}>{reason}</li>
        ))}
      </ol>
    )
  ) : (
    'There was a problem with your KYC verification'
  );
  return (
    <CardContent
      title='Verification failed'
      icon={() => (
        <AlertTriangle className='mr-1.5 inline-block size-6 text-red-500' />
      )}
      description={desc}
    />
  );
};
