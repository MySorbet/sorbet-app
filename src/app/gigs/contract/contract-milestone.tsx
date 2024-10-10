import { Check, Lock, Plus, Zap } from 'lucide-react';
import React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ContractMilestoneStatus } from '@/types';

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
  handleMilestoneFunding: () => void;
  handleMilestoneSubmission: () => void;
  handleMilestoneApprove: () => void;
}

/**
 * These are the individual milestones that you see in the 'Contract' tab of gigs-dialog
 */
export const ContractMilestone = ({
  isApproved = false,
  status,
  fundingButtonDisabled = false,
  title,
  amount,
  index,
  isClient,
  milestoneId,
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
        return 'Released';
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
      className={`flex w-full flex-col gap-2 px-4 py-3 ${
        isCompleted ? 'cursor-not-allowed opacity-60' : ''
      } ${isApproved ? 'min-h-32' : ''}`}
      tabIndex={isCompleted ? -1 : 0}
      key={`milestone-${index}`}
    >
      <div
        className={`flex h-full flex-row justify-between${
          isCompleted ? 'pointer-events-none' : ''
        }`}
      >
        <div className='flex justify-start'>
          <div className='flex flex-row gap-3'>
            {status === ContractMilestoneStatus.FundingPending && (
              <div className='h-8 w-8 rounded-full border border-gray-300 p-2'>
                <Lock size={14} strokeWidth={3} stroke='#667085' />
              </div>
            )}
            {status === ContractMilestoneStatus.Approved && (
              <div className='h-8 w-8 rounded-full border border-[#E5E4F8] bg-[#F3F3F9] p-2'>
                <Check size={16} strokeWidth={4} stroke='#AA91EF' />{' '}
              </div>
            )}
            {(status === ContractMilestoneStatus.Active ||
              status === ContractMilestoneStatus.InReview) && (
              <div className='h-8 w-8 rounded-full border border-[#D9D6FE] bg-[#F4F3FF] p-2'>
                <Zap size={16} strokeWidth={4} stroke='#7A5AF8' />{' '}
              </div>
            )}

            <div className='flex flex-col gap-1'>
              <h2 className='font-medium'>{title}</h2>
              <p className='text-sm font-medium'>${amount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className='flex h-full flex-col justify-end gap-4'>
          <div className='flex h-full flex-col justify-between text-right'>
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
          </div>
        </div>
      </div>
      <div className='flex items-end justify-end'>
        {isClient && status === ContractMilestoneStatus.Active && (
          <h2 className='text-center font-medium text-gray-400'>Funded</h2>
        )}
        {isClient && (
          <>
            {isApproved &&
              status === ContractMilestoneStatus.FundingPending && (
                <>
                  <Button
                    variant='default'
                    className={`bg-sorbet hover:bg-sorbet/70 rounded-xl ${
                      fundingButtonDisabled &&
                      `bg-sorbet/30 disabled text-[#B39DEE]`
                    }`}
                    size='sm'
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
                  className={`bg-sorbet hover:bg-sorbet/70 rounded-xl ${
                    fundingButtonDisabled &&
                    `bg-sorbet/30  disabled text-[#B39DEE]`
                  }`}
                  size='sm'
                  onClick={handleMilestoneApprove}
                >
                  Release <Check className='ml-1' size={17} />
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
                    className={`bg-sorbet hover:bg-sorbet/70 rounded-xl ${
                      status === ContractMilestoneStatus.InReview &&
                      `bg-sorbet/30 disabled text-[#B39DEE]`
                    }`}
                    size='sm'
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
    </Card>
  );
};
