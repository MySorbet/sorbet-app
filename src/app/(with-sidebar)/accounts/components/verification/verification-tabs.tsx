import { ChevronRight, FileCheck, FileText, ShieldCheck } from 'lucide-react';

import { mockBridgeCustomer } from '@/api/bridge/mock-bridge-customer';
import { PoaDropzone } from '@/app/(with-sidebar)/accounts/components/verification/poa-dropzone';
import { PersonaCard } from '@/app/(with-sidebar)/verify/components/persona-card';
import { TosIframe } from '@/app/(with-sidebar)/verify/components/tos-iframe';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const VerificationTabs = () => {
  // TODO: Calculate selected tab from bridge customer state
  return (
    <div className='flex w-full max-w-3xl flex-col gap-2'>
      <Tabs defaultValue='terms'>
        <TabsList className='w-full justify-between gap-2'>
          <TabsTrigger value='terms' className='flex-1 gap-2'>
            <ShieldCheck className='size-4' />
            1. Terms
          </TabsTrigger>
          <ChevronRight className='size-4' />
          <TabsTrigger value='details' className='flex-1 gap-2'>
            <FileText className='size-4' />
            2. Details
          </TabsTrigger>
          <ChevronRight className='size-4' />
          <TabsTrigger value='proof' className='flex-1 gap-2'>
            <FileCheck className='size-4' />
            3. Proof
          </TabsTrigger>
        </TabsList>
        <TabsContent value='terms'>
          <TosIframe url={mockBridgeCustomer.tos_link} />
        </TabsContent>
        <TabsContent value='details'>
          <PersonaCard url={mockBridgeCustomer.kyc_link} />
        </TabsContent>
        <TabsContent value='proof'>
          <PoaDropzone />
        </TabsContent>
      </Tabs>
    </div>
  );
};
