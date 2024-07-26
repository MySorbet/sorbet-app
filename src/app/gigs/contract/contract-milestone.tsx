import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ContractMilestoneStatus } from '@/types';
import { Check, Lock, Plus, Zap } from 'lucide-react';
import React from 'react';

export interface ContractMilestoneProps {
  isApproved?: boolean;
  milestoneId: string;
  status: ContractMilestoneStatus;
  fundingButtonDisabled?: boolean;
  title: string;
  amount: number;
  index: number;
  projectId: string;
  isClient: boolean;
  isFixedPrice?: boolean;
  handleMilestoneFunding: () => void;
  handleMilestoneSubmission: () => void;
  handleMilestoneApprove: () => void;
}

export const ContractMilestone = ({
  isApproved = false,
  status,
  fundingButtonDisabled = false,
  title,
  amount,
  index,
  isClient,
  milestoneId,
  isFixedPrice = false,
  handleMilestoneFunding,
  handleMilestoneSubmission,
  handleMilestoneApprove,
}: ContractMilestoneProps) => {
  const isCompleted = status === ContractMilestoneStatus.Approved;

  const mapStatusLabel = () => {
    switch (status) {
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
            {status === ContractMilestoneStatus.FundingPending && (
              <div className='rounded-full border border-gray-300 p-2 w-8 h-8'>
                <Lock size={14} strokeWidth={3} stroke='#667085' />
              </div>
            )}
            {status === ContractMilestoneStatus.Approved && (
              <div className='bg-[#F3F3F9] rounded-full border border-[#E5E4F8] p-2 w-8 h-8'>
                <Check size={16} strokeWidth={4} stroke='#AA91EF' />{' '}
              </div>
            )}
            {(status === ContractMilestoneStatus.Active ||
              status === ContractMilestoneStatus.InReview) && (
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
                  status === ContractMilestoneStatus.Active
                    ? 'success'
                    : 'outline'
                }
              >
                {mapStatusLabel()}
              </Badge>
            </div>
            <div>
              {isClient && status === ContractMilestoneStatus.Active && (
                <h2 className='text-center text-gray-400 font-medium'>
                  Funded
                </h2>
              )}
              {isClient && (
                <>
                  {isApproved &&
                    status === ContractMilestoneStatus.FundingPending && (
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

                  {status === ContractMilestoneStatus.InReview && (
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
                    (status === ContractMilestoneStatus.Active ||
                      status === ContractMilestoneStatus.InReview) && (
                      <>
                        <Button
                          variant='default'
                          className={`bg-sorbet rounded-xl hover:bg-sorbet/70 ${
                            status === ContractMilestoneStatus.InReview &&
                            `bg-sorbet/30 text-[#B39DEE] text-sorbet disabled`
                          }`}
                          size={`sm`}
                          onClick={handleMilestoneSubmission}
                          disabled={status === ContractMilestoneStatus.InReview}
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
