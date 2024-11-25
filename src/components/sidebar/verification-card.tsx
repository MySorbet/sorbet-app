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
  tosStatus?: TOSStatus /** HAS the user accepted the terms of service? */;
  kycStatus?: KYCStatus /** The status of the user's KYC verification */;
  onComplete?: () => void /** Callback for when the primary action button is clicked. This can mean a few different things depending on the state of the card. */;
  disabled?: boolean /** Disables the primary action button?*/;
  indeterminate?: boolean /** Whether the verification process is indeterminate. Use this to optimistically render a loading state before KYC is approved. */;
  missingEmail?: boolean /** Whether the user has an email associated with their sorbet account */;
  rejectionReason?: string /** The reason the user's KYC was rejected. Only rendered if `kycStatus` is `rejected` */;
  isCollapsed?: boolean /** Whether the card is collapsed. If true, the card will not render the progress bar or the remaining steps. Use this after verification is complete. */;
}

export const VerificationCard = ({
  tosStatus,
  kycStatus,
  onComplete,
  disabled = false,
  indeterminate = false,
  missingEmail = false,
  rejectionReason,
  isCollapsed = false,
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

  const titleStatus = indeterminate
    ? 'indeterminate'
    : isApproved
    ? 'approved'
    : isRejected
    ? 'rejected'
    : 'default';

  const descriptionStatus = indeterminate
    ? 'indeterminate'
    : isApproved
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
        <DynamicCardDescription
          status={descriptionStatus}
          rejectionReason={rejectionReason}
        />
      </CardHeader>

      {/* Only show the remaining steps if the user hasn't completed the verification process or the card is not collapsed */}
      {!(isRejected || isCollapsed) && (
        <CardContent className='space-y-4 p-4 pt-3'>
          <Progress
            value={progress}
            indeterminate={indeterminate}
            className='[&>*]:bg-sorbet h-2'
          />

          <div className='space-y-2'>
            <CheckItem completed={termsAccepted}>
              Accept terms of service
            </CheckItem>
            <CheckItem completed={detailsAdded}>Add personal details</CheckItem>
          </div>
        </CardContent>
      )}
      {!isCollapsed && (
        <CardFooter className='flex justify-between gap-4 p-4 pt-0'>
          <Button variant='ghost' asChild>
            <a href='https://docs.mysorbet.xyz'>Learn more</a>
          </Button>
          <MissingEmailTooltip showTooltip={missingEmail}>
            <Button
              onClick={onComplete}
              variant='sorbet'
              disabled={disabled || missingEmail || inReview || indeterminate}
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
          </MissingEmailTooltip>
        </CardFooter>
      )}
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
  indeterminate: 'Verification processing...',
};

const DynamicCardTitle = ({
  status,
}: {
  status: keyof typeof titleContent;
}) => {
  return (
    <CardTitle
      className='animate-in fade-in slide-in-from-left-1 flex items-center gap-2 text-sm font-medium'
      key={status}
    >
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
  notStarted: 'Verify your account to accept payments via ACH/Wire',
  tosAccepted:
    'Complete your account verification to accept payments via ACH/Wire',
  pending: 'Account verification under review. Please check back shortly.',
  approved: 'You can now accept payments via ACH/Wire',
  rejected: 'There was a problem with your KYC verification',
  indeterminate:
    'Thank your for submitting KYC. It can take up to 1 minute to process your details.',
};

const DynamicCardDescription = ({
  status,
  rejectionReason,
}: {
  status: keyof typeof descriptionContent;
  rejectionReason?: string;
}) => {
  return (
    <CardDescription
      className='animate-in fade-in slide-in-from-left-1 text-xs'
      key={status}
    >
      {status === 'rejected' && rejectionReason
        ? rejectionReason
        : descriptionContent[status]}
    </CardDescription>
  );
};

/**
 * Low hanging fruit tooltip that provides users without an email the reason why they can't get verified
 */
const MissingEmailTooltip = ({
  children,
  showTooltip,
}: {
  children: React.ReactNode;
  showTooltip: boolean;
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{children}</TooltipTrigger>
        {showTooltip && (
          <TooltipContent className='max-w-72'>
            You must have an email associated with your sorbet account to get
            verified
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};
