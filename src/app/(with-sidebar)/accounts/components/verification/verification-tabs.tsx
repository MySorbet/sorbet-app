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

import { mockBridgeCustomer } from '@/api/bridge/mock-bridge-customer';
import { PoaDropzone } from '@/app/(with-sidebar)/accounts/components/verification/poa-dropzone';
import { PersonaCard } from '@/app/(with-sidebar)/verify/components/persona-card';
import { TosIframe } from '@/app/(with-sidebar)/verify/components/tos-iframe';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export const VERIFICATION_END_STATES = [
  'complete',
  'rejected',
  'under_review',
] as const;
export type VerificationEndState = (typeof VERIFICATION_END_STATES)[number];

export type VerificationTab =
  | 'terms'
  | 'details'
  | 'proof'
  | VerificationEndState;
/**
 * Displays verification steps as tabs with the corresponding content below.
 *
 * The tab shown should be calculated outside and passed in as `selectedTab`.
 */
export const VerificationTabs = ({
  selectedTab,
  loading,
}: {
  /** Which tab is selected */
  selectedTab: VerificationTab;
  /** `selectedTab` will be ignored while loading. A Skeleton will be shown instead. */
  loading?: boolean;
}) => {
  return (
    <Tabs
      value={loading ? undefined : selectedTab}
      className='flex size-full flex-col'
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
            <TosIframe
              url={mockBridgeCustomer.tos_link}
              className='size-full max-w-full'
            />
          </TabsContent>
          <TabsContent value='details' className='size-full flex-1'>
            <PersonaCard
              url={mockBridgeCustomer.kyc_link}
              className='h-full max-w-full overflow-clip p-0'
            />
          </TabsContent>
          <TabsContent value='proof' className='size-full flex-1'>
            <PoaDropzone className='size-full' />
          </TabsContent>

          {/* End states */}
          <TabsContent value='complete' className='size-full flex-1'>
            <EndTab
              title='Verification complete'
              description='Your verification is complete'
            >
              <CircleCheck className='size-8 text-green-500' />
            </EndTab>
          </TabsContent>
          <TabsContent value='rejected' className='size-full flex-1'>
            <EndTab
              title='Verification rejected'
              description='Your verification has been rejected'
            >
              <CircleX className='size-8 text-red-500' />
            </EndTab>
          </TabsContent>
          <TabsContent value='under_review' className='size-full flex-1'>
            <EndTab
              title='Verification under review'
              description='Your verification is under review'
            >
              <Hourglass className='size-8 text-yellow-500' />
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
}: {
  title: string;
  description: string;
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'flex size-full flex-col items-center justify-center gap-2',
        className
      )}
    >
      {children}
      <h1 className='text-2xl font-bold'>{title}</h1>
      <p className='text-muted-foreground text-sm'>{description}</p>
    </div>
  );
};
