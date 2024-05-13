import {
  ContractClientMilestone,
  ContractClientMilestoneFundingStatus,
  ContractClientMilestoneStatus,
} from '@/app/gigs/contract';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import React, { useState } from 'react';

export const ContractOverview = () => {
  const [contractApproved, setContractApproved] = useState<boolean>(false);

  const handleApprove = () => {
    setContractApproved(true);
  };

  const handleReject = () => {
    setContractApproved(false);
  };

  return (
    <div className='contract-container p-4 bg-gray-100 rounded-2xl flex flex-col items-center w-full h-full'>
      <div className='flex flex-row w-full justify-between items-start'>
        <div className='flex flex-col gap-1'>
          <h2 className='font-medium text-2xl'>
            {contractApproved ? 'Contract Approved' : 'Review Contract'}
          </h2>
          <p>
            {contractApproved
              ? 'Get started funding milestones. The freelancer will be notified once you’ve added funds.'
              : 'Review and approve contract before funding milestones'}
          </p>
        </div>
        <div className='flex align-center items-center justify-end h-full cursor-pointer'>
          <HelpCircle className='w-6 h-6' stroke='#667085' />
        </div>
      </div>
      <div className='flex flex-col gap-3 mt-6 w-full'>
        <ContractClientMilestone
          isApproved={contractApproved}
          status={
            contractApproved
              ? ContractClientMilestoneStatus.Completed
              : ContractClientMilestoneStatus.PendingApproval
          }
          fundingStatus={ContractClientMilestoneFundingStatus.funded}
        />
        <ContractClientMilestone
          isApproved={contractApproved}
          status={
            contractApproved
              ? ContractClientMilestoneStatus.InProgress
              : ContractClientMilestoneStatus.PendingApproval
          }
          fundingStatus={ContractClientMilestoneFundingStatus.funded}
        />
        <ContractClientMilestone
          isApproved={contractApproved}
          status={
            contractApproved
              ? ContractClientMilestoneStatus.FundsPending
              : ContractClientMilestoneStatus.PendingApproval
          }
          fundingStatus={ContractClientMilestoneFundingStatus.pending}
        />
        <ContractClientMilestone
          isApproved={contractApproved}
          status={
            contractApproved
              ? ContractClientMilestoneStatus.FundsPending
              : ContractClientMilestoneStatus.PendingApproval
          }
          fundingStatus={ContractClientMilestoneFundingStatus.pending}
          fundingButtonDisabled
        />
      </div>
      {!contractApproved && (
        <>
          <div className='flex gap-2 mt-4 w-full'>
            <Button
              onClick={handleReject}
              className='w-full md:w-1/6 lg:w-2/12 bg-red-600 text-white'
            >
              Reject
            </Button>
            <Button
              onClick={handleApprove}
              className='w-full md:w-5/6 lg:w-10/12 bg-sorbet text-white hover:bg-sorbet/70'
            >
              Approve
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
