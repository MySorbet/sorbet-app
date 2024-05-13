import { ContractFixedPrice, ContractMilestones } from '@/app/gigs/contract';
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
import React, { useState } from 'react';

export const ContractContainer = () => {
  return (
    <div className='contract-container p-4 py-12 bg bg-gray-100 rounded-2xl flex flex-col items-center w-full h-full'>
      <Tabs defaultValue='milestones' className='w-full px-12'>
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
          <ContractMilestones />
        </TabsContent>
        <TabsContent value='fixed-price'>
          <ContractFixedPrice />
        </TabsContent>
      </Tabs>
    </div>
  );
};
