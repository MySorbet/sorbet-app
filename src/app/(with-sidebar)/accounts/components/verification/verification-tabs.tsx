import {
  ChevronRight,
  CircleCheck,
  CircleX,
  FileCheck,
  FileText,
  Hourglass,
  MapPin,
  MapPinCheckInside,
  Shield,
  ShieldCheck,
} from 'lucide-react';

import { PoaDropzone } from '@/app/(with-sidebar)/accounts/components/verification/poa-dropzone';
import { PersonaCard } from '@/app/(with-sidebar)/verify/components/persona-card';
import { TosIframe } from '@/app/(with-sidebar)/verify/components/tos-iframe';
import { Spinner } from '@/components/common/spinner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export const VERIFICATION_END_STATES = [
  'active',
  'rejected',
  'under_review',
] as const;
export type VerificationEndState = (typeof VERIFICATION_END_STATES)[number];

export type VerificationTab =
  | 'terms'
  | 'details'
  | 'proof'
  | VerificationEndState
  | 'indeterminate';
/**
 * Displays verification steps as tabs with the corresponding content below.
 *
 * The tab shown should be calculated outside and passed in as `selectedTab`.
 */
export const VerificationTabs = ({
  selectedTab,
  loading,
  tosUrl,
  kycUrl,
  onComplete,
  className,
  onRetry,
}: {
  /** Which tab is selected */
  selectedTab: VerificationTab;
  /** `selectedTab` will be ignored while loading. A Skeleton will be shown instead. */
  loading?: boolean;
  /** The URL of the Terms of Service */
  tosUrl: string;
  /** The URL of the KYC link */
  kycUrl: string;
  /** Callback when KYC input is complete. Use this to go indeterminate until the webhook event is received. */
  onComplete?: () => void;
  /** Callback when the user wants to retry the verification. Triggerable from the rejected or indeterminate tabs. */
  onRetry?: () => void;
  /** Additional className for the tabs list */
  className?: string;
}) => {
  return (
    <Tabs
      value={loading ? undefined : selectedTab}
      className={cn('flex size-full flex-col', className)}
    >
      <TabsList
        className='pointer-events-none w-full justify-between gap-2'
        tabIndex={-1}
      >
        <TabsTrigger value='terms' className='flex-1 gap-2'>
          {selectedTab === 'terms' ? (
            <Shield className='size-4' />
          ) : (
            <ShieldCheck className='size-4' />
          )}
          1. Terms
        </TabsTrigger>
        <ChevronRight className='size-4' />
        <TabsTrigger value='details' className='flex-1 gap-2'>
          {selectedTab === 'details' || selectedTab === 'terms' ? (
            <FileText className='size-4' />
          ) : (
            <FileCheck className='size-4' />
          )}
          2. Details
        </TabsTrigger>
        {selectedTab === 'proof' && (
          <>
            <ChevronRight className='size-4' />
            <TabsTrigger value='proof' className='flex-1 gap-2'>
              {selectedTab === 'proof' ? (
                <MapPin className='size-4' />
              ) : (
                <MapPinCheckInside className='size-4' />
              )}
              3. Proof
            </TabsTrigger>
          </>
        )}
      </TabsList>
      {loading ? (
        <Skeleton className='mt-2 size-full' />
      ) : (
        <>
          <TabsContent value='terms' className='flex-1'>
            <TosIframe url={tosUrl} className='size-full max-w-full' />
          </TabsContent>
          <TabsContent value='details' className='size-full flex-1'>
            <PersonaCard
              url={kycUrl}
              className='h-full max-w-full overflow-clip p-0'
              onComplete={onComplete}
            />
          </TabsContent>
          <TabsContent value='proof' className='size-full flex-1'>
            <PoaDropzone className='size-full' />
          </TabsContent>

          {/* End states */}
          <TabsContent value='active' className='size-full flex-1'>
            <EndTab
              title='Verification complete'
              description='Your verification is complete'
              icon={<CircleCheck className='size-8 text-green-500' />}
            ></EndTab>
          </TabsContent>
          <TabsContent value='rejected' className='size-full flex-1'>
            <EndTab
              title='Verification rejected'
              description='Your verification has been rejected'
              icon={<CircleX className='size-8 text-red-500' />}
            >
              {/* TODO: Add rejection reasons */}
              <Button variant='ghost' onClick={onRetry}>
                Try again
              </Button>
            </EndTab>
          </TabsContent>
          <TabsContent value='under_review' className='size-full flex-1'>
            <EndTab
              title='Account under review'
              description="Your account is currently under review and will be finalized within 24 hours. We'll notify you via email when it's ready."
            >
              <Hourglass className='size-8 text-yellow-500' />
            </EndTab>
          </TabsContent>

          <TabsContent value='indeterminate' className='size-full flex-1'>
            <EndTab
              title='Verification pending'
              description="KYC verification is currently pending. Please check back shortly, or
        we'll notify you via email!"
              icon={<Spinner className='size-8' />}
            >
              <Button variant='ghost' onClick={onRetry}>
                Go back to details
              </Button>
            </EndTab>
          </TabsContent>
        </>
      )}
    </Tabs>
  );
};

const EndTab = ({
  title,
  description,
  children,
  className,
  icon,
}: {
  title: string;
  description: string;
  children?: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}) => {
  return (
    <Card
      className={cn(
        'flex size-full flex-col items-center justify-center gap-2 p-6 text-center',
        className
      )}
    >
      {icon}
      <h1 className='text-2xl font-bold'>{title}</h1>
      <p className='text-muted-foreground text-sm'>{description}</p>
      {children}
    </Card>
  );
};
