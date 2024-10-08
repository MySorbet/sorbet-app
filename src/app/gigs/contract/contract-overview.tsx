import { HelpCircle, TriangleAlert } from 'lucide-react';
import React from 'react';

import { ContractMilestone } from '@/app/gigs/contract';
import { Spinner } from '@/components/common';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  ContractMilestoneStatus,
  ContractType,
  MilestoneType,
  OfferType,
} from '@/types';

export interface ContractOverviewProps {
  contract: ContractType;
  milestones?: MilestoneType[];
  isClient: boolean;
  offer?: OfferType;
  contractApproved: boolean;
  isRejectDialogOpen: boolean;
  setIsRejectDialogOpen: () => void;
  isLoading: boolean;
  handleApprove: () => void;
  handleReject: () => void;
  confirmReject: () => void;
  cancelReject: () => void;
  finishContract: () => void;
  handleMilestoneFunding: (
    projectId: string,
    scheduleId: string,
    amount: number,
    milestoneId: string,
    index: number
  ) => Promise<void>;
  handleMilestoneSubmission: (
    projectId: string,
    milestoneId: string
  ) => Promise<void>;
  handleMilestoneApprove: (
    projectId: string,
    milestoneId: string,
    offerId?: string,
    index?: number
  ) => Promise<void>;
}

export const ContractOverview = ({
  contract,
  milestones,
  isClient,
  offer,
  contractApproved,
  isRejectDialogOpen,
  setIsRejectDialogOpen,
  isLoading,
  handleApprove,
  handleReject,
  confirmReject,
  cancelReject,
  finishContract,
  handleMilestoneFunding,
  handleMilestoneSubmission,
  handleMilestoneApprove,
}: ContractOverviewProps) => {
  const mapContractStatusToMilestoneStatus = (status: string) => {
    switch (status) {
      case 'NotStarted':
      case 'PendingApproval':
        return ContractMilestoneStatus.FundingPending;
      case 'InProgress':
        return ContractMilestoneStatus.Active;
      case 'Rejected':
        return ContractMilestoneStatus.FundingPending;
      case 'Completed':
        return ContractMilestoneStatus.Approved;
      case 'InReview':
      default:
        return ContractMilestoneStatus.InReview;
    }
  };

  const mapContractTypeToMilestoneTitle = (type: string, name: string) => {
    switch (type) {
      case 'FixedPrice':
        return 'Fixed Price Contract';
      default:
        return name;
    }
  };

  const mapContractTypeToGigDlgTitle = (type: string) => {
    switch (type) {
      case 'NotStarted':
        return 'Contract Approved';
      case 'InProgress':
        return 'Contract is in Progress';
      case 'InReview':
        return 'Review Contract';
      case 'Completed':
        return 'Contract Completed';
      default:
        return '';
    }
  };

  const mapContractTypeToGigDlgText = (contract: ContractType) => {
    switch (contract.status) {
      case 'PendingApproval':
        return 'Review and approve contract before funding milestones';
      case 'NotStarted':
        return isClient
          ? 'Get started funding milestones. The freelancer will be notified once you’ve added funds.'
          : '';
      case 'InProgress':
        return isClient
          ? ''
          : 'Submit your design once a milestone is complete. You’ll an receive instant payment once approved by the client.';
      case 'InReview':
        return contract.name + '\n' + contract.description;
      case 'Completed':
        return offer?.projectName + '\n' + offer?.projectDescription;
      default:
        return '';
    }
  };

  return (
    <div className='contract-container flex h-full w-full flex-col items-center rounded-2xl bg-gray-100 p-4'>
      <AlertDialog
        open={isRejectDialogOpen}
        onOpenChange={setIsRejectDialogOpen}
      >
        <AlertDialogContent>
          <div className='align-center flex flex-col items-center justify-center gap-4'>
            <div>
              <TriangleAlert
                className='h-24 w-24'
                strokeWidth={1}
                stroke='#595C5A'
              />
            </div>
            <div className='text-3xl font-semibold'>Reject contract?</div>
            <div className='px-8 text-center text-lg'>
              Confirm if you would like to reject this contract. The freelancer
              will be notified.
            </div>
            <div className='mt-12 flex w-full flex-row gap-2'>
              <AlertDialogCancel className='w-full' onClick={cancelReject}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className='w-full bg-red-600'
                onClick={confirmReject}
              >
                Reject Contract
              </AlertDialogAction>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <div className='flex w-full flex-row items-start justify-between'>
        {isLoading && (
          <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-25'>
            <Spinner />
          </div>
        )}
        <div className='flex flex-col gap-1'>
          <h2 className='text-2xl font-medium'>
            {mapContractTypeToGigDlgTitle(contract?.status)}
            {/* {contractApproved ? 'Contract Approved' : 'Review Contract'} */}
          </h2>
          <p className='whitespace-pre-line md:w-[80%]'>
            {/* {contractApproved
              ? isClient
                ? 'Get started funding milestones. The freelancer will be notified once you’ve added funds.'
                : 'Submit your design once a milestone is complete. You’ll an receive instant payment once approved by the client.'
              : 'Review and approve contract before funding milestones'} */}
            {mapContractTypeToGigDlgText(contract)}
          </p>
        </div>
        <div className='align-center flex h-full cursor-pointer items-center justify-end'>
          <HelpCircle className='h-6 w-6' stroke='#667085' />
        </div>
      </div>
      <div className='mt-6 flex w-full flex-col gap-3'>
        {milestones && milestones.length > 0 ? (
          <>
            {milestones.map((milestone: MilestoneType, index: number) => (
              <ContractMilestone
                isApproved={contractApproved}
                status={milestone.status}
                title={mapContractTypeToMilestoneTitle(
                  contract.contractType,
                  milestone.name
                )}
                amount={milestone.amount}
                index={index}
                key={index}
                projectId={contract.id}
                isClient={isClient}
                milestoneId={milestone.id}
                handleMilestoneFunding={() =>
                  handleMilestoneFunding(
                    contract.id,
                    index.toString(),
                    milestone.amount,
                    milestone.id,
                    index
                  )
                }
                handleMilestoneSubmission={() =>
                  handleMilestoneSubmission(contract.id, milestone.id)
                }
                handleMilestoneApprove={() =>
                  handleMilestoneApprove(
                    contract.id,
                    milestone.id,
                    offer?.id,
                    index
                  )
                }
              />
            ))}
          </>
        ) : (
          <></>
        )}
      </div>
      <div className='w-full'>
        {!contractApproved ? (
          <>
            <div className='mt-4 flex w-full gap-2'>
              <Button
                onClick={handleReject}
                className='w-full bg-red-600 text-white md:w-1/6 lg:w-2/12'
              >
                Reject
              </Button>
              <Button
                onClick={handleApprove}
                className='bg-sorbet hover:bg-sorbet/70 w-full text-white md:w-5/6 lg:w-10/12'
              >
                Approve
              </Button>
            </div>
          </>
        ) : (
          contract?.status != 'Completed' &&
          !isClient && (
            <div className='mt-4 flex w-full gap-2'>
              <Button
                onClick={finishContract}
                className='bg-sorbet w-full text-white md:w-1/6 lg:w-2/12'
                disabled={
                  !(
                    contract?.status === 'InReview' &&
                    offer?.status === 'Accepted'
                  )
                }
              >
                Finish Contract
              </Button>
            </div>
          )
        )}
      </div>
    </div>
  );
};
