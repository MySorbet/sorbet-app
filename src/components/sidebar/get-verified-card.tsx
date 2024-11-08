import { CheckCircle, Circle } from '@untitled-ui/icons-react';

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

interface GetVerifiedCardProps {
  termsAccepted?: boolean;
  detailsAdded?: boolean;
  onComplete?: () => void;
}

export default function GetVerifiedCard({
  termsAccepted = false,
  detailsAdded = false,
  onComplete,
}: GetVerifiedCardProps) {
  // Progress starts with a little full, goes to 50 with accepted terms, and to 100 when details are added
  const progress =
    (0.2 + Number(termsAccepted) * 0.3 + Number(detailsAdded) * 0.5) * 100;

  const isComplete = termsAccepted && detailsAdded;

  const header = isComplete ? 'Verified account' : 'KYC verification';
  const description = isComplete
    ? 'You’ve verified your account. You can now accept payments via ACH/Wire or Credit Card'
    : 'Verify your account to accept payments via ACH/Wire or Credit Card';

  return (
    <Card>
      <CardHeader className='p-4'>
        <CardTitle className='text-sm font-medium'>{header}</CardTitle>
        <CardDescription className='text-xs'>{description}</CardDescription>
      </CardHeader>

      {/* Only show the remaining steps if the user hasn't completed the verification process */}
      {!isComplete && (
        <>
          <CardContent className='space-y-4 p-4 pt-3'>
            <Progress value={progress} className='[&>*]:bg-sorbet h-2' />

            <div className='space-y-2'>
              <CheckItem completed={termsAccepted}>
                Accept terms of service
              </CheckItem>
              <CheckItem completed={detailsAdded}>
                Add personal details
              </CheckItem>
            </div>
          </CardContent>
          <CardFooter className='flex justify-between gap-4 p-4 pt-0'>
            <Button variant='ghost' asChild>
              <a href='https://docs.mysorbet.xyz'>Learn more</a>
            </Button>
            <Button onClick={onComplete} variant='sorbet'>
              Complete Verification
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
}

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
