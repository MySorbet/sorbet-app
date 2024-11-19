import { AlertTriangle, CheckCircle, Circle } from '@untitled-ui/icons-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { KYCStatus, TOSStatus } from '@/types';

interface VerificationCardProps {
  tosStatus?: TOSStatus;
  kycStatus?: KYCStatus;
  onComplete?: () => void;
  disabled?: boolean;
}

export const VerificationCard = ({
  tosStatus,
  kycStatus,
  onComplete,
  disabled = false,
}: VerificationCardProps) => {
  // Convenience approved states
  const termsAccepted = tosStatus === 'approved';
  const kycApproved = kycStatus === 'approved';

  // Composite states
  // Verification is approved if both kyc and terms are approved
  // Verification is rejected if kyc is rejected (no matter TOS)
  const isApproved = kycApproved && termsAccepted;
  const isRejected = kycStatus === 'rejected';

  // We consider verification in review if kyc is in any of these states
  const inReview =
    kycStatus &&
    ['awaiting_ubo', 'manual_review', 'under_review', 'pending'].includes(
      kycStatus
    );
  // We consider details added if kyc is in review or approved
  const detailsAdded = inReview || kycApproved;

  // Progress starts with a little full, goes to 50 with accepted terms, and to 100 when details are added
  const progress =
    (0.2 + Number(termsAccepted) * 0.3 + Number(detailsAdded) * 0.5) * 100;

  const titleStatus = isApproved
    ? 'approved'
    : isRejected
    ? 'rejected'
    : 'default';

  const descriptionStatus = isApproved
    ? 'approved'
    : isRejected
    ? 'rejected'
    : inReview
    ? 'pending'
    : termsAccepted
    ? 'tosAccepted'
    : 'notStarted';

  return (
    <Card>
      <CardHeader className='p-4'>
        <DynamicCardTitle status={titleStatus} />
        <DynamicCardDescription status={descriptionStatus} />
      </CardHeader>

      {/* Only show the remaining steps if the user hasn't completed the verification process */}
      {!isRejected && (
        <CardContent className='space-y-4 p-4 pt-3'>
          <Progress value={progress} className='[&>*]:bg-sorbet h-2' />

          <div className='space-y-2'>
            <CheckItem completed={termsAccepted}>
              Accept terms of service
            </CheckItem>
            <CheckItem completed={detailsAdded}>Add personal details</CheckItem>
          </div>
        </CardContent>
      )}
      <CardFooter className='flex justify-between gap-4 p-4 pt-0'>
        <Button variant='ghost' asChild>
          <a href='https://docs.mysorbet.xyz'>Learn more</a>
        </Button>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onComplete}
                variant='sorbet'
                disabled={disabled || inReview || isApproved}
                className='min-w-44'
              >
                {isApproved
                  ? 'Close'
                  : isRejected
                  ? 'Try again'
                  : inReview
                  ? 'In review'
                  : termsAccepted
                  ? 'Complete Verification'
                  : 'Get Verified'}
              </Button>
            </TooltipTrigger>
            {disabled && (
              <TooltipContent>
                <p>
                  You must have an email associated with your sorbet account to
                  get verified
                </p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
};

/**
 * Local component to display a single step in the verification process and whether it has been completed
 */
const CheckItem = ({
  children,
  completed,
}: {
  children: React.ReactNode;
  completed: boolean;
}) => {
  return (
    <div className='flex items-center gap-2'>
      {completed ? (
        <CheckCircle className='text-sorbet animate-in fade-in zoom-in-0 size-4' />
      ) : (
        <Circle className='text-muted-foreground size-4' />
      )}
      <span className='text-sm font-medium'>{children}</span>
    </div>
  );
};

const titleContent = {
  default: 'KYC verification',
  approved: 'Account approved',
  rejected: 'Kyc verification failed',
};

const DynamicCardTitle = ({
  status,
}: {
  status: keyof typeof titleContent;
}) => {
  return (
    <CardTitle className='flex items-center gap-2 text-sm font-medium'>
      {status === 'rejected' && (
        <AlertTriangle className='size-4 text-red-500' />
      )}
      {status === 'approved' && (
        <CheckCircle className='size-4 text-green-500' />
      )}
      {titleContent[status]}
    </CardTitle>
  );
};

const descriptionContent = {
  notStarted:
    'Verify your account to accept payments via ACH/Wire or Credit Card',
  tosAccepted:
    'Complete your account verification to accept payments via ACH/Wire or Credit Card',
  pending: 'Account verification under review. Please check back shortly.',
  approved: 'You can now accept payments via ACH/Wire or Credit Card',
  rejected: 'Kyc verification failed', // TODO: Accept and render a reason
};

const DynamicCardDescription = ({
  status,
}: {
  status: keyof typeof descriptionContent;
}) => {
  return (
    <CardDescription className='text-xs'>
      {descriptionContent[status]}
    </CardDescription>
  );
};
