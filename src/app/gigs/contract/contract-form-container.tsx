import { CircleCheckBig } from 'lucide-react';
import React from 'react';

import {
  ContractFormFixedPrice,
  ContractFormFixedPriceData,
  ContractFormMilestones,
  ContractMilestonesFormData,
} from '@/app/gigs/contract';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OfferType } from '@/types';

export interface ContractContainerProps {
  tab: string;
  setTab: (tab: string) => void;
  isFormSubmitted: boolean;
  onMilestonesFormSubmit: (
    formData: ContractMilestonesFormData
  ) => Promise<void>;
  onFixedPriceFormSubmit: (
    formData: ContractFormFixedPriceData
  ) => Promise<void>;
  handleRejectOfferClick?: () => void;
  currentOffer?: OfferType;
}

export const ContractFormContainer = ({
  tab,
  setTab,
  isFormSubmitted,
  onMilestonesFormSubmit,
  onFixedPriceFormSubmit,
  handleRejectOfferClick,
  currentOffer,
}: ContractContainerProps) => {
  if (isFormSubmitted) {
    return (
      <div className='contract-container p-4 py-12 bg bg-gray-100 rounded-2xl flex flex-col items-center w-full h-full align-center justify-center'>
        <div className='flex flex-col gap-4 items-center md:w-[50%] lg:md:w-[50%] text-center'>
          <CircleCheckBig stroke='#16B269' className='w-24 h-24' />
          <h2 className='font-semibold text-3xl'>Contract submitted</h2>
          <p>
            Your contract has been sent to your client for approval. Check back
            soon for an update.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='contract-container p-4 lg:px-24 md:lg:px-20 py-12 bg bg-gray-100 rounded-2xl flex flex-col items-center w-full h-full overflow-y-auto'>
      <Tabs value={tab} onValueChange={setTab} className='w-full px-12'>
        <div className='w-full flex items-center align-center justify-center'>
          <TabsList className='grid w-full grid-cols-2 bg-[#FAFAFA] rounded-full h-12 shadow-[0px_1px_2px_0px_#1018280D] w-[85%] lg:w-[60%]'>
            <TabsTrigger
              value='milestones'
              className="rounded-full data-[state=active]:bg-sorbet data-[state=active]:text-white h-10"
            >
              Milestones
            </TabsTrigger>
            <TabsTrigger
              value='fixed-price'
              className="rounded-full data-[state=active]:bg-sorbet data-[state=active]:text-white h-10"
            >
              Fixed Price
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value='milestones'>
          <ContractFormMilestones
            onFormSubmit={onMilestonesFormSubmit}
            projectName={currentOffer?.projectName}
          />
        </TabsContent>
        <TabsContent value='fixed-price'>
          <ContractFormFixedPrice
            onFormSubmit={onFixedPriceFormSubmit}
            projectName={currentOffer?.projectName}
          />
        </TabsContent>
      </Tabs>
      <div className='w-[85%]'>
        <Button
          variant='destructive'
          className='w-full mt-4'
          onClick={handleRejectOfferClick}
        >
          Reject Offer
        </Button>
      </div>
    </div>
  );
};
