import { updateContractStatus } from '@/api/gigs';
import { ContractClientMilestone } from '@/app/gigs/contract';
import { Spinner } from '@/components/common';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ContractType, MilestoneType } from '@/types';
import { HelpCircle, TriangleAlert } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export interface ContractOverviewProps {
  contract: ContractType;
  milestones?: MilestoneType[];
  isClient: boolean;
}

export const ContractOverview = ({
  contract,
  milestones,
  isClient,
}: ContractOverviewProps) => {
  const [contractApproved, setContractApproved] = useState<boolean>(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const handleApprove = async () => {
    setIsLoading(true);
    if (contract) {
      const response = await updateContractStatus(contract.id, 'NotStarted');
      if (response && response.status === 'success') {
        setContractApproved(true);
        toast({
          title: 'Contract approved',
          description: 'You can start by funding the milestones',
        });
      } else {
        toast({
          title: 'Something went wrong',
          description:
            'Unable to approve contract. If the issue persists, please contact support',
        });
      }
    }
    setIsLoading(false);
  };

  const handleReject = () => {
    setIsRejectDialogOpen(true);
  };

  const confirmReject = async () => {
    setIsLoading(true);
    if (contract) {
      const response = await updateContractStatus(contract.id, 'Rejected');
      if (response && response.status === 'success') {
        setContractApproved(false);
        setIsRejectDialogOpen(false);
        toast({
          title: 'Contract rejected',
          description: 'The contract offer was rejected',
        });
      } else {
        toast({
          title: 'Something went wrong',
          description:
            'Unable to reject contract. If the issue persists, please contact support',
        });
      }
    }
    setIsLoading(false);
  };

  const cancelReject = () => {
    setIsRejectDialogOpen(false);
  };

  useEffect(() => {
    if (
      contract.status !== 'Rejected' &&
      contract.status !== 'PendingApproval'
    ) {
      setContractApproved(true);
    }
  }, [contract]);

  return (
    <div className='contract-container p-4 bg-gray-100 rounded-2xl flex flex-col items-center w-full h-full'>
      <AlertDialog
        open={isRejectDialogOpen}
        onOpenChange={setIsRejectDialogOpen}
      >
        <AlertDialogContent>
          <div className='flex flex-col gap-4 justify-center items-center align-center'>
            <div>
              <TriangleAlert
                className='w-24 h-24'
                strokeWidth={1}
                stroke={`#595C5A`}
              />
            </div>
            <div className='text-3xl font-semibold'>Reject contract?</div>
            <div className='px-8 text-lg text-center'>
              Confirm if you would like to reject this contract. The freelancer
              will be notified.
            </div>
            <div className='flex flex-row gap-2 w-full mt-12'>
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

      <div className='flex flex-row w-full justify-between items-start'>
        {isLoading && (
          <div className='absolute inset-0 bg-black bg-opacity-25 flex justify-center items-center'>
            <Spinner />
          </div>
        )}
        <div className='flex flex-col gap-1'>
          <h2 className='font-medium text-2xl'>
            {contractApproved ? 'Contract Approved' : 'Review Contract'}
          </h2>
          <p className='md:w-[80%]'>
            {contractApproved
              ? isClient
                ? 'Get started funding milestones. The freelancer will be notified once you’ve added funds.'
                : 'Submit your design once a milestone is complete. You’ll an receive instant payment once approved by the client.'
              : 'Review and approve contract before funding milestones'}
          </p>
        </div>
        <div className='flex align-center items-center justify-end h-full cursor-pointer'>
          <HelpCircle className='w-6 h-6' stroke='#667085' />
        </div>
      </div>
      <div className='flex flex-col gap-3 mt-6 w-full'>
        {milestones && milestones.length > 0 && (
          <>
            {milestones.map((milestone: MilestoneType, index: number) => (
              <ContractClientMilestone
                isApproved={contractApproved}
                status={milestone.status}
                title={milestone.name}
                amount={milestone.amount}
                index={index}
                projectId={contract.id}
                isClient={isClient}
              />
            ))}
          </>
        )}
      </div>
      <div className='w-full'>
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
    </div>
  );
};
