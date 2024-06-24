import { createContract, updateOfferStatus } from '@/api/gigs';
import {
  ContractFixedPrice,
  ContractFixedPriceData,
  ContractMilestone,
  ContractMilestones,
  ContractMilestonesFormData,
} from '@/app/gigs/contract';
import { useWalletSelector } from '@/components/common';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { CONTRACT_ID } from '@/constant/constant';
import { useLocalStorage } from '@/hooks';
import { toYoctoNEAR } from '@/lib/helper';
import { CreateContractType, OfferType } from '@/types';
import { Transaction } from '@near-wallet-selector/core';
import { CircleCheckBig } from 'lucide-react';
import React, { useState } from 'react';

export interface ContractContainerProps {
  handleRejectOfferClick?: () => void;
  afterContractSubmited?: () => void;
  currentOffer?: OfferType;
}

export const ContractContainer = ({
  handleRejectOfferClick,
  afterContractSubmited,
  currentOffer,
}: ContractContainerProps) => {
  const [tab, setTab] = useState<string>('milestones');
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
  const { toast } = useToast();
  const { selector, accounts } = useWalletSelector();
  const [lastChainOp, setLastChainOp] = useLocalStorage<string>(
    'lastChainOp',
    ''
  );
  const onMilestonesFormSubmit = async (
    formData: ContractMilestonesFormData
  ) => {
    if (tab === 'milestones' && currentOffer) {
      const totalAmount = formData.milestones.reduce(
        (sum, milestone) => sum + milestone.amount,
        0
      );
      const reqBody: CreateContractType = {
        name: formData.projectName,
        totalAmount: totalAmount,
        contractType: 'Milestones',
        milestones: formData.milestones,
        offerId: currentOffer.id,
        clientUsername: currentOffer.username,
      };

      const response = await createContract(reqBody);
      if (response && response.status === 'success') {
        await createOnchainContract(
          response.data?.id,
          currentOffer.username,
          formData.milestones
        );
        setIsFormSubmitted(true);
        if (afterContractSubmited) {
          afterContractSubmited();
        }
      } else {
        toast({
          title: 'Unable to submit contract',
          description: 'Something went wrong, please try again',
        });
      }
    }
  };

  const createOnchainContract = async (
    projectId: string,
    clientAccountId: string,
    milestones?: ContractMilestone[]
  ) => {
    if (accounts.length > 0) {
      setLastChainOp('create_project');
      const transactions: Array<Transaction> = [];
      transactions.push({
        signerId: accounts[0].accountId,
        receiverId: CONTRACT_ID,
        actions: [
          {
            type: 'FunctionCall',
            params: {
              methodName: 'create_project',
              args: {
                project_id: projectId,
                client_id: clientAccountId,
              },
              gas: '300000000000000', // gas amount
              deposit: '0', // No deposit needed for this function call
            },
          },
        ],
      });

      if (milestones) {
        milestones.forEach((milestone: ContractMilestone, index: number) => {
          transactions.push({
            signerId: accounts[0].accountId,
            receiverId: CONTRACT_ID,
            actions: [
              {
                type: 'FunctionCall',
                params: {
                  methodName: 'add_schedule',
                  args: {
                    project_id: projectId,
                    short_code: `m${index + 1}`,
                    description: milestone.name,
                    value: toYoctoNEAR(milestone.amount.toFixed()),
                  },
                  gas: '300000000000000', // gas amount
                  deposit: '100000000000000000000000', // 0.1 NEAR deposit
                },
              },
            ],
          });
        });
      }

      const wallet = await selector.wallet();
      return await wallet
        .signAndSendTransactions({ transactions })
        .catch((err) => {
          toast({
            title: 'Transaction Failed',
            description: 'Failed to create project on the NEAR blockchain.',
            variant: 'destructive',
          });
          console.error('Failed to create project', err);
          throw err;
        });
    }
  };

  const onFixedPriceFormSubmit = async (formData: ContractFixedPriceData) => {
    if (tab === 'fixed-price' && currentOffer) {
      const reqBody: CreateContractType = {
        name: formData.projectName,
        totalAmount: formData.totalAmount,
        contractType: 'FixedPrice',
        offerId: currentOffer.id,
        clientUsername: currentOffer.username,
      };

      const response = await createContract(reqBody);
      if (response && response.status === 'success') {
        await createOnchainContract(response.data?.id, currentOffer.username);
        setIsFormSubmitted(true);
        if (afterContractSubmited) {
          afterContractSubmited();
        }
      } else {
        toast({
          title: 'Unable to submit contract',
          description: 'Something went wrong, please try again',
        });
      }
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
    <div className='contract-container p-4 lg:px-24 md:lg:px-20 py-12 bg bg-gray-100 rounded-2xl flex flex-col items-center w-full h-full'>
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
          <ContractMilestones
            onFormSubmit={onMilestonesFormSubmit}
            projectName={currentOffer?.projectName}
          />
        </TabsContent>
        <TabsContent value='fixed-price'>
          <ContractFixedPrice
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
