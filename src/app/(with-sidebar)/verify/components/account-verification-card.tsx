import { useQueryClient } from '@tanstack/react-query';
import { ExternalLink } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { Spinner } from '@/components/common/spinner';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCreateDueCustomer } from '@/hooks/profile/use-create-due-customer';
import { useDueCustomer } from '@/hooks/profile/use-due-customer';
import { useScopedLocalStorage } from '@/hooks/use-scoped-local-storage';
import { cn, sleep } from '@/lib/utils';

import { useConfettiCannons } from '../hooks/use-confetti-cannons';
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
  isRejected?: boolean;
}) => {
  const isComplete = step === 'complete' && !isRejected && !isUnderReview;

  const queryClient = useQueryClient();
  const { data: dueCustomer } = useDueCustomer();

  const { mutate: createDueCustomer, isPending: isCreating } =
    useCreateDueCustomer({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['dueCustomer'] });
        onStepComplete?.('begin');
      },
      onError: (error) => {
        const message = `Error creating account: ${error instanceof Error ? error.message : 'Unknown error'}`;
        console.error(message);
        toast.error(message);
      },
    });

  // We consider this loading while the api call is pending, or it has returned and we are waiting for the account to be created
  const isCreatingAccount = isCreating || (dueCustomer && !dueCustomer.account);

  // This is only callable when there is no Due customer
  // Success callback will complete this step
  // Error will toast and remain on this step
  const handleGetVerified = () => {
    createDueCustomer();
  };

  // When terms are accepted in new tab, poll for updates
  const handleTermsComplete = async () => {
    await sleep(1000); // Wait 1 second to give time to update
    queryClient.invalidateQueries({ queryKey: ['dueCustomer'] });
    onStepComplete?.('terms');
  };

  // When KYC is completed in new tab, notify parent
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
        {(isIndeterminate || isUnderReview) && <IndeterminateContent />}
        {isComplete && <CompleteContent />}
        {isRejected && <RejectedContent rejectionReasons={rejectionReasons} />}
        {!isIndeterminate &&
          !isComplete &&
          !isRejected &&
          !isUnderReview && <DefaultContent />}

        {/* Step specific content */}
        {step === 'begin' && !isIndeterminate && !isUnderReview && (
          <Button
            variant='sorbet'
            onClick={handleGetVerified}
            disabled={isCreatingAccount}
            className='@xs:max-w-fit w-full'
          >
            {isCreatingAccount && <Spinner />}
            Start verification
          </Button>
        )}

        {tosLink && step === 'terms' && (
          <Button
            variant='sorbet'
            onClick={() => {
              window.open(tosLink, '_blank', 'noopener,noreferrer');
              // Poll for updates after user opens the link
              setTimeout(() => handleTermsComplete(), 5000);
            }}
            className='@xs:max-w-fit w-full'
          >
            <ExternalLink className='mr-2 size-4' />
            Accept Terms of Service
          </Button>
        )}

        {kycLink && !isIndeterminate && step === 'details' && (
          <Button
            variant='sorbet'
            onClick={() => {
              window.open(kycLink, '_blank', 'noopener,noreferrer');
              // Poll for updates after user opens the link
              setTimeout(() => handleDetailsComplete(), 5000);
            }}
            className='@xs:max-w-fit w-full'
          >
            <ExternalLink className='mr-2 size-4' />
            Complete KYC Verification
          </Button>
        )}

        {isComplete && (
          <Button
            variant='sorbet'
            onClick={() => onCallToActionClick?.('create-invoice')}
            className='@xs:max-w-fit w-full'
          >
            Create your first invoice
          </Button>
        )}

        {isRejected && (
          <Button
            variant='sorbet'
            onClick={() => onCallToActionClick?.('retry')}
            className='@xs:max-w-fit w-full'
          >
            Start again
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
      icon={() => (
        <img
          src='/svg/orange-loader-icon.svg'
          alt='Pending'
          className='mr-1.5 inline-block size-6 animate-spin'
        />
      )}
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
        <img
          src='/svg/green-tick-icon.svg'
          alt='Verified'
          className='mr-1.5 inline-block size-6'
        />
      )}
    />
  );
};

/** Local component specializing the card content for the default state */
const DefaultContent = () => {
  return (
    <CardContent
      title='Persona’s account verification'
      description='Verify your account by adding your personal details to accept payments via ACH/Wire or Credit Card.'
    />
  );
};

const RejectedContent = ({
  rejectionReasons,
}: {
  rejectionReasons?: string[];
}) => {
  const desc = rejectionReasons && rejectionReasons.length > 0 ? (
    rejectionReasons.length === 1 ? (
      rejectionReasons[0]
    ) : (
      <ol className='list-inside list-decimal'>
        {rejectionReasons.map((reason, index) => (
          <li key={index}>{reason}</li>
        ))}
      </ol>
    )
  ) : (
    'Your verification was not approved. Please try again or contact support at support@sorbet.com if you need assistance.'
  );
  return (
    <CardContent
      title='Verification failed'
      icon={() => (
        <img
          src='/svg/red-cross-icon.svg'
          alt='Failed'
          className='mr-1.5 inline-block size-6'
        />
      )}
      description={desc}
    />
  );
};
