import {
  updateContractStatus,
  updateMilestoneStatus,
  updateOfferStatus,
} from '@/api/gigs';
import { useWalletSelector } from '@/components/common/near-wallet/walletSelectorContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { CONTRACT_ID } from '@/constant/constant';
import { useAuth, useLocalStorage } from '@/hooks';
import { toYoctoNEAR } from '@/lib/helper';
import { ContractMilestoneStatus } from '@/types';
import BigNumber from 'bignumber.js';
import { Check, Lock, Plus, Zap } from 'lucide-react';
import React from 'react';

export interface ContractClientMilestoneProps {
  isApproved?: boolean;
  milestoneId: string;
  status: ContractMilestoneStatus;
  fundingButtonDisabled?: boolean;
  title: string;
  amount: number;
  index: number;
  projectId: string;
  isClient: boolean;
}

export const ContractClientMilestone = ({
  isApproved = false,
  status,
  fundingButtonDisabled = false,
  title,
  amount,
  index,
  projectId,
  isClient,
  milestoneId,
}: ContractClientMilestoneProps) => {
  const [currentStatus, setCurrentStatus] = React.useState(status);
  const isCompleted = currentStatus === ContractMilestoneStatus.Approved;
  const { accounts, selector } = useWalletSelector();
  const [lastChainOp, setLastChainOp] = useLocalStorage<string>(
    'lastChainOp',
    ''
  );
  const { user } = useAuth();
  const { toast } = useToast();

  const mapStatusLabel = () => {
    switch (currentStatus) {
      case ContractMilestoneStatus.Active:
        return 'Active';
      case ContractMilestoneStatus.Approved:
        return 'Approved';
      case ContractMilestoneStatus.FundingPending:
        return 'Funds Pending';
      case ContractMilestoneStatus.InReview:
        return 'In Review';
      default:
        return 'Unknown Status';
    }
  };

  const onMilestoneFunded = async (
    projectId: string,
    scheduleId: string,
    amount: number
  ) => {
    if (accounts.length > 0) {
      setLastChainOp('fund_schedule');
      await updateMilestoneStatus(milestoneId, 'Active');
      setCurrentStatus(ContractMilestoneStatus.Active);
      if (index == 0) {
        // We use index to identify which milestone it is, as it is used in the smart contract as schedule_id
        // If it's the first milestone being funded, update the contract status to started.
        await updateContractStatus(projectId, 'InProgress');
      }
      const finalAmount = BigNumber(amount).multipliedBy(1.021).abs().toFixed();
      const wallet = await selector.wallet();
      return await wallet
        .signAndSendTransaction({
          signerId: accounts[0].accountId,
          receiverId: CONTRACT_ID,
          actions: [
            {
              type: 'FunctionCall',
              params: {
                methodName: 'fund_schedule',
                args: {
                  project_id: projectId,
                  schedule_id: scheduleId,
                },
                gas: '300000000000000', // gas amount
                deposit: toYoctoNEAR(finalAmount),
              },
            },
          ],
        })
        .catch((err) => {
          toast({
            title: 'Transaction Failed',
            description: 'Failed to fund milestone on the NEAR blockchain.',
            variant: 'destructive',
          });
          console.error('Failed to fund milestone', err);
          throw err;
        });
    } else {
      toast({
        title: 'Unable to fund milestone',
        description: 'No connected wallet was detected. Please try again.',
      });
    }
  };

  const handleMilestoneFunding = async () => {
    if (accounts.length > 0) {
      if (user?.balance?.usdc && user?.balance?.usdc >= amount) {
        setLastChainOp('fund_schedule');
        await onMilestoneFunded(projectId, index.toString(), amount);
      } else {
        toast({
          title: 'Insufficient balance',
          description: `You need at least ${amount} USDC to perform this action. Only ${user?.balance?.usdc} USDC was detected`,
        });
      }
    } else {
      toast({
        title: 'Something went wrong',
        description: 'Your NEAR wallet was not detected. Please try again',
        variant: 'destructive',
      });
    }
  };

  const handleMilestoneSubmission = async () => {
    if (title === 'Fixed Price Contract') {
      toast({
        title: 'Work submitted',
        description: 'Your work is in review now and awaiting approval',
      });
      setCurrentStatus(ContractMilestoneStatus.InReview);
    } else {
      const response = await updateMilestoneStatus(milestoneId, 'InReview');
      if (response.status && response.status === 'success') {
        toast({
          title: 'Milestone submitted',
          description: 'Milestone is in review now and awaiting approval',
        });
        setCurrentStatus(ContractMilestoneStatus.InReview);
      } else {
        toast({
          title: 'Something went wrong',
          description: 'Unable to submit milestone, please try again',
          variant: 'destructive',
        });
      }
    }
  };

  const handleMilestoneApprove = async () => {
    const response = await updateMilestoneStatus(milestoneId, 'Approved');
    if (response.status && response.status === 'success') {
      setLastChainOp('approve_schedule');
      const wallet = await selector.wallet();
      await wallet
        .signAndSendTransaction({
          signerId: accounts[0].accountId,
          receiverId: CONTRACT_ID,
          actions: [
            {
              type: 'FunctionCall',
              params: {
                methodName: 'approve_schedule',
                args: {
                  project_id: projectId.toString(),
                  schedule_id: index.toString(),
                },
                gas: '300000000000000', // gas amount
                deposit: toYoctoNEAR('0'),
              },
            },
          ],
        })
        .catch((err) => {
          toast({
            title: 'Transaction Failed',
            description: 'Failed to approve milestone on the NEAR blockchain.',
            variant: 'destructive',
          });
          console.error('Failed to fund milestone', err);
          throw err;
        });
    } else {
      toast({
        title: 'Something went wrong',
        description: 'Unable to approve milestone, please try again',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card
      className={`w-full p-4 ${
        isCompleted ? 'opacity-60 cursor-not-allowed' : ''
      } ${isApproved ? 'min-h-32' : ''}`}
      tabIndex={isCompleted ? -1 : 0}
      key={`milestone-${index}`}
    >
      <div
        className={`flex flex-row justify-between h-full ${
          isCompleted ? 'pointer-events-none' : ''
        }`}
      >
        <div className='flex justify-start'>
          <div className='flex flex-row gap-3'>
            {currentStatus === ContractMilestoneStatus.FundingPending && (
              <div className='rounded-full border border-gray-300 p-2 w-8 h-8'>
                <Lock size={14} strokeWidth={3} stroke='#667085' />
              </div>
            )}
            {currentStatus === ContractMilestoneStatus.Approved && (
              <div className='bg-[#F3F3F9] rounded-full border border-[#E5E4F8] p-2 w-8 h-8'>
                <Check size={16} strokeWidth={4} stroke='#AA91EF' />{' '}
              </div>
            )}
            {(currentStatus === ContractMilestoneStatus.Active ||
              currentStatus === ContractMilestoneStatus.InReview) && (
              <div className='bg-[#F4F3FF] rounded-full border border-[#D9D6FE] p-2 w-8 h-8'>
                <Zap size={16} strokeWidth={4} stroke='#7A5AF8' />{' '}
              </div>
            )}

            <div className='flex flex-col gap-1'>
              <h2 className='font-medium'>{title}</h2>
              <p className='font-medium text-sm'>${amount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className='flex flex-col justify-end h-full'>
          <div className='flex flex-col justify-between text-right h-full'>
            <div>
              <Badge
                variant={
                  currentStatus === ContractMilestoneStatus.Active
                    ? 'success'
                    : 'outline'
                }
              >
                {mapStatusLabel()}
              </Badge>
            </div>
            <div>
              {isClient && currentStatus === ContractMilestoneStatus.Active && (
                <h2 className='text-center text-gray-400 font-medium'>
                  Funded
                </h2>
              )}
              {isClient && (
                <>
                  {isApproved &&
                    currentStatus ===
                      ContractMilestoneStatus.FundingPending && (
                      <>
                        <Button
                          variant='default'
                          className={`bg-sorbet rounded-xl hover:bg-sorbet/70 ${
                            fundingButtonDisabled &&
                            `bg-sorbet/30 text-[#B39DEE] text-sorbet disabled`
                          }`}
                          size={`sm`}
                          onClick={handleMilestoneFunding}
                        >
                          Add Funds <Plus className='ml-1' size={17} />
                        </Button>
                      </>
                    )}

                  {currentStatus === ContractMilestoneStatus.InReview && (
                    <>
                      <Button
                        variant='default'
                        className={`bg-sorbet rounded-xl hover:bg-sorbet/70 ${
                          fundingButtonDisabled &&
                          `bg-sorbet/30 text-[#B39DEE] text-sorbet disabled`
                        }`}
                        size={`sm`}
                        onClick={handleMilestoneApprove}
                      >
                        Approve <Check className='ml-1' size={17} />
                      </Button>
                    </>
                  )}
                </>
              )}
              {!isClient && (
                <>
                  {isApproved &&
                    (currentStatus === ContractMilestoneStatus.Active ||
                      currentStatus === ContractMilestoneStatus.InReview) && (
                      <>
                        <Button
                          variant='default'
                          className={`bg-sorbet rounded-xl hover:bg-sorbet/70 ${
                            currentStatus ===
                              ContractMilestoneStatus.InReview &&
                            `bg-sorbet/30 text-[#B39DEE] text-sorbet disabled`
                          }`}
                          size={`sm`}
                          onClick={handleMilestoneSubmission}
                          disabled={
                            currentStatus === ContractMilestoneStatus.InReview
                          }
                        >
                          Submit Work
                        </Button>
                      </>
                    )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
