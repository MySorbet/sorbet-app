import { ChevronRight, FileCheck, FileText, ShieldCheck } from 'lucide-react';

import { mockBridgeCustomer } from '@/api/bridge/mock-bridge-customer';
import { PoaDropzone } from '@/app/(with-sidebar)/accounts/components/verification/poa-dropzone';
import { PersonaCard } from '@/app/(with-sidebar)/verify/components/persona-card';
import { TosIframe } from '@/app/(with-sidebar)/verify/components/tos-iframe';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export type VerificationTab = 'terms' | 'details' | 'proof';
/**
 * Displays verification steps as tabs with the corresponding content below.
 *
 * The tab shown should be calculated outside and passed in as `selectedTab`.
 */
export const VerificationTabs = ({
  selectedTab,
  loading,
}: {
  selectedTab: VerificationTab;
  loading: boolean;
}) => {
  return (
    <Tabs
      defaultValue={selectedTab}
      value={selectedTab}
      className='flex size-full flex-col'
    >
      <TabsList
        className='pointer-events-none w-full justify-between gap-2'
        tabIndex={-1}
      >
        <TabsTrigger value='terms' className='flex-1 gap-2'>
          <ShieldCheck className='size-4' />
          1. Terms
        </TabsTrigger>
        <ChevronRight className='size-4' />
        <TabsTrigger value='details' className='flex-1 gap-2'>
          <FileText className='size-4' />
          2. Details
        </TabsTrigger>
        {selectedTab === 'proof' && (
          <>
            <ChevronRight className='size-4' />
            <TabsTrigger value='proof' className='flex-1 gap-2'>
              <FileCheck className='size-4' />
              3. Proof
            </TabsTrigger>
          </>
        )}
      </TabsList>
      {loading ? (
        <Skeleton className='mt-2 size-full' />
      ) : (
        <>
          <TabsContent value='terms' className=' flex-1'>
            <TosIframe
              url={mockBridgeCustomer.tos_link}
              className='size-full max-w-full'
            />
          </TabsContent>
          <TabsContent value='details' className='size-full flex-1'>
            <PersonaCard
              url={mockBridgeCustomer.kyc_link}
              className='h-full max-w-full'
            />
          </TabsContent>
          <TabsContent value='proof' className='size-full flex-1'>
            <PoaDropzone className='size-full' />
          </TabsContent>
        </>
      )}
    </Tabs>
  );
};
