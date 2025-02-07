import { useQueryClient } from '@tanstack/react-query';
import { CircleCheck } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { Spinner } from '@/components/common/spinner';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useVerify } from '@/hooks/profile/use-verify';
import { cn, sleep } from '@/lib/utils';

import { useConfettiCannons } from '../hooks/use-confetti-cannons';
import { VerifyStep } from './kyc-checklist';
import { PersonaCard } from './persona-card';
import { TosIframe } from './tos-iframe';
import { VerifyCard } from './verify-card';

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
}: {
  className?: string;
  step?: VerifyStep | 'complete' | 'get-verified';
  onStepComplete?: (step: VerifyStep | 'get-verified') => void;
  onCallToActionClick?: () => void;
  isLoading?: boolean;
  tosLink?: string;
  kycLink?: string;
  isIndeterminate?: boolean;
}) => {
  const isComplete = step === 'complete';

  const queryClient = useQueryClient();

  const { mutate: createBridgeCustomer, isPending: isCreating } = useVerify({
    onSuccess: () => {
      console.log('Successfully created bridge customer');
      queryClient.invalidateQueries({ queryKey: ['bridgeCustomer'] });
      onStepComplete?.('get-verified');
    },
    onError: (error) => {
      const message = `Error creating bridge customer: ${error.message}`;
      console.error(message);
      toast.error(message);
    },
  });

  // Text display is dependent on if verification is complete (or rejected)
  const title = isComplete ? 'Account Verified' : 'Account Verification';
  const description = isComplete
    ? 'Congrats! You can now accept payments via ACH/Wire or Credit Card. Try sending an invoice to test it out.'
    : 'Verify your account to accept payments via ACH/Wire or Credit Card.';

  // This is only callable when there is no bridge customer
  const handleGetVerified = () => {
    createBridgeCustomer();
    // Success callback will complete this step
    // Error will toast and remain on this step
  };

  // When bridge frame fires complete event, invalidate the bridge customer query and advance to the next step
  const handleTermsComplete = async () => {
    await sleep(1000); // Wait 1 second to avoid flashing a confirmation message and give bridge time to update the customer
    queryClient.invalidateQueries({ queryKey: ['bridgeCustomer'] });
    onStepComplete?.('terms');
  };

  const handleDetailsComplete = () => {
    queryClient.invalidateQueries({ queryKey: ['bridgeCustomer'] });
    onStepComplete?.('details');
    // There could be a small wait time for the webhook to be processed. We may need to go indeterminate here to wait for that while polling
  };

  // Confetti on complete
  const { fire } = useConfettiCannons();
  useEffect(() => {
    isComplete && fire();
  }, [fire, isComplete]);

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
        {!isIndeterminate && !isComplete && <DefaultContent />}

        {/* Step specific content */}
        {step === 'get-verified' && (
          <Button
            variant='sorbet'
            onClick={handleGetVerified}
            disabled={isCreating}
            className='@xs:max-w-fit w-full'
          >
            {isCreating && <Spinner size='small' className='mr-2' />}
            Get verified
          </Button>
        )}

        {tosLink && step === 'terms' && (
          <TosIframe url={tosLink} onComplete={handleTermsComplete} />
        )}

        {kycLink && step === 'details' && (
          <PersonaCard url={kycLink} onComplete={handleDetailsComplete} />
        )}

        {isComplete && (
          <Button
            variant='sorbet'
            onClick={onCallToActionClick}
            className='@xs:max-w-fit w-full'
          >
            Create an invoice
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
  description: string;
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
  return (
    <CardContent
      title='Account verified'
      description='Congrats! You can now accept payments via ACH/Wire or Credit Card. Try sending an invoice to test it out.'
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
      description='Verify your account to accept payments via ACH/Wire or Credit Card.'
    />
  );
};
