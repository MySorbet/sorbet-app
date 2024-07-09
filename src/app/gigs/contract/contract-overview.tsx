import { updateContractStatus, updateOfferStatus } from '@/api/gigs';
import { ContractClientMilestone } from '@/app/gigs/contract';
import { Spinner, useWalletSelector } from '@/components/common';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { CONTRACT_ID } from '@/constant/constant';
import { useLocalStorage } from '@/hooks';
import { toYoctoNEAR } from '@/lib/helper';
import {
  ContractMilestoneStatus,
  ContractType,
  MilestoneType,
  OfferType,
} from '@/types';
import { HelpCircle, TriangleAlert } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export interface ContractOverviewProps {
  contract: ContractType;
  milestones?: MilestoneType[];
  isClient: boolean;
  offer?: OfferType;
}

export const ContractOverview = ({
  contract,
  milestones,
  isClient,
  offer,
}: ContractOverviewProps) => {
  const [contractApproved, setContractApproved] = useState<boolean>(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState<boolean>(false);
  const { accounts, selector } = useWalletSelector();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastChainOp, setLastChainOp] = useLocalStorage<string>(
    'lastChainOp',
    ''
  );
  const { toast } = useToast();

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

  const handleApprove = async () => {
    setIsLoading(true);
    if (contract) {
      const response = await updateContractStatus(contract.id, 'NotStarted');
      if (response && response.data) {
        if (offer) {
          await updateOfferStatus(offer?.id, 'Accepted');
        }
        setContractApproved(true);
        toast({
          title: 'Contract approved',
          description: 'You can now fund the contract.',
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
      if (response && response.data) {
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

  const finishContract = async () => {
    const response = await updateContractStatus(contract.id, 'Completed');
    if (response.status && response.data) {
      setLastChainOp('end_project');
      if (offer) {
        await updateOfferStatus(offer?.id, 'Completed');
      }
      const wallet = await selector.wallet();
      await wallet
        .signAndSendTransaction({
          signerId: accounts[0].accountId,
          receiverId: CONTRACT_ID,
          actions: [
            {
              type: 'FunctionCall',
              params: {
                methodName: 'end_project',
                args: {
                  project_id: contract.id,
                },
                gas: '300000000000000',
                deposit: toYoctoNEAR('0'),
              },
            },
          ],
        })
        .catch((err) => {
          toast({
            title: 'Transaction Failed',
            description: 'Failed to end project on the NEAR blockchain.',
            variant: 'destructive',
          });
          console.error('Failed to fund milestone', err);
          throw err;
        });
    }
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
        {milestones && milestones.length > 0 ? (
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
                milestoneId={milestone.id}
              />
            ))}
          </>
        ) : (
          <ContractClientMilestone
            isApproved={contractApproved}
            status={mapContractStatusToMilestoneStatus(contract.status)}
            title={`Fixed Price Contract`}
            amount={contract.totalAmount}
            index={0}
            projectId={contract.id}
            isClient={isClient}
            milestoneId={contract.id}
            isFixedPrice={true}
          />
        )}
      </div>
      <div className='w-full'>
        {!contractApproved ? (
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
        ) : (
          !isClient && (
            <div className='flex gap-2 mt-4 w-full'>
              <Button
                onClick={finishContract}
                className='w-full md:w-1/6 lg:w-2/12 bg-sorbet text-white'
                disabled={offer?.status === 'Completed'}
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
