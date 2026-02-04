import { ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

import { Spinner } from '@/components/common/spinner';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCreateDueCustomer } from '@/hooks/profile/use-create-due-customer';
import { cn } from '@/lib/utils';

import { VerifyCard } from '../../components/verify-card';

type DueVerifyStep = 'begin' | 'terms' | 'details' | 'complete';

export const DueAccountVerificationCard = ({
  className,
  step,
  isLoading,
  tosLink,
  kycLink,
  isIndeterminate,
  isRejected,
}: {
  className?: string;
  step: DueVerifyStep;
  isLoading?: boolean;
  tosLink?: string;
  kycLink?: string;
  isIndeterminate?: boolean;
  isRejected?: boolean;
}) => {
  const isComplete = step === 'complete' && !isRejected;

  const { mutate: createDueCustomer, isPending: isCreating } =
    useCreateDueCustomer({
      onError: (error) => {
        const message = `Error creating Due account: ${error instanceof Error ? error.message : 'Unknown error'}`;
        toast.error(message);
      },
    });

  const handleStartVerification = () => {
    createDueCustomer();
  };

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
        {isRejected && <RejectedContent />}
        {!isIndeterminate && !isComplete && !isRejected && <DefaultContent />}

        {step === 'begin' && (
          <Button
            variant='sorbet'
            onClick={handleStartVerification}
            disabled={isCreating}
            className='@xs:max-w-fit w-full'
          >
            {isCreating && <Spinner />}
            Start verification
          </Button>
        )}

        {tosLink && step === 'terms' && (
          <Button
            variant='sorbet'
            onClick={() => window.open(tosLink, '_blank', 'noopener,noreferrer')}
            className='@xs:max-w-fit w-full'
          >
            <ExternalLink className='mr-2 size-4' />
            Accept Terms of Service
          </Button>
        )}

        {kycLink && step === 'details' && (
          <Button
            variant='sorbet'
            onClick={() => window.open(kycLink, '_blank', 'noopener,noreferrer')}
            className='@xs:max-w-fit w-full'
          >
            <ExternalLink className='mr-2 size-4' />
            Complete KYC Verification
          </Button>
        )}
      </div>
    </VerifyCard>
  );
};

const CardContent = ({
  title,
  description,
  icon,
}: {
  title: string;
  description: React.ReactNode;
  icon?: () => React.ReactNode;
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

const IndeterminateContent = () => {
  return (
    <CardContent
      title='Verification pending'
      description="Your KYC verification is pending. We'll notify you once it’s updated."
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

const CompleteContent = () => {
  return (
    <CardContent
      title='Account verified'
      description='Your Due account is verified. Your virtual accounts will appear shortly.'
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

const DefaultContent = () => {
  return (
    <CardContent
      title='Due account verification'
      description='Complete Due TOS and KYC to enable fiat on-ramping.'
    />
  );
};

const RejectedContent = () => {
  return (
    <CardContent
      title='Verification failed'
      description='Your KYC was not approved. Please contact support if you need help.'
      icon={() => (
        <img
          src='/svg/red-cross-icon.svg'
          alt='Failed'
          className='mr-1.5 inline-block size-6'
        />
      )}
    />
  );
};
