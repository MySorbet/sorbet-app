import {
  ContractFixedPrice,
  ContractFixedPriceData,
  ContractMilestones,
  ContractMilestonesFormData,
} from '@/app/gigs/contract';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CircleCheckBig } from 'lucide-react';
import React, { useState } from 'react';

export const ContractContainer = () => {
  const [tab, setTab] = useState<string>('milestones');
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);

  const onMilestonesFormSubmit = (formData: ContractMilestonesFormData) => {
    if (tab === 'milestones') {
      setIsFormSubmitted(true);
      console.log(formData);
    }
  };

  const onFixedPriceFormSubmit = (formData: ContractFixedPriceData) => {
    if (tab === 'fixed-price') {
      setIsFormSubmitted(true);
      console.log(formData);
    }
  };

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
    <div className='contract-container p-4 py-12 bg bg-gray-100 rounded-2xl flex flex-col items-center w-full h-full'>
      <Tabs value={tab} onValueChange={setTab} className='w-full px-12'>
        <div className='w-full flex items-center align-center justify-center'>
          <TabsList className='grid w-full grid-cols-2 bg-[#FAFAFA] rounded-full h-12 shadow-[0px_1px_2px_0px_#1018280D] w-[85%] lg:w-[60%]'>
            <TabsTrigger
              value='milestones'
              className={`rounded-full data-[state=active]:bg-sorbet data-[state=active]:text-white h-10`}
            >
              Milestones
            </TabsTrigger>
            <TabsTrigger
              value='fixed-price'
              className={`rounded-full data-[state=active]:bg-sorbet data-[state=active]:text-white h-10`}
            >
              Fixed Price
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value='milestones'>
          <ContractMilestones onFormSubmit={onMilestonesFormSubmit} />
        </TabsContent>
        <TabsContent value='fixed-price'>
          <ContractFixedPrice onFormSubmit={onFixedPriceFormSubmit} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
