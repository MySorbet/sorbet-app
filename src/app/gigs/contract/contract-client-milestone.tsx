import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Lock, Plus, Check, Zap } from 'lucide-react';
import React from 'react';

export enum ContractClientMilestoneStatus {
  PendingApproval = 'Pending approval',
  InProgress = 'In-progress',
  Completed = 'Completed',
  FundsPending = 'Funds pending',
}

export enum ContractClientMilestoneFundingStatus {
  pending,
  funded,
}

export interface ContractClientMilestoneProps {
  isApproved?: boolean;
  status: ContractClientMilestoneStatus;
  fundingStatus: ContractClientMilestoneFundingStatus;
  fundingButtonDisabled?: boolean;
  title: string;
  amount: number;
  isClient: boolean;
}

export const ContractClientMilestone = ({
  isApproved = false,
  status,
  fundingStatus,
  fundingButtonDisabled = false,
  title,
  amount,
  isClient,
}: ContractClientMilestoneProps) => {
  const isCompleted = status === ContractClientMilestoneStatus.Completed;

  return (
    <Card
      className={`w-full p-4 ${
        isCompleted ? 'opacity-60 cursor-not-allowed' : ''
      } ${isApproved ? 'min-h-32' : ''}`}
      tabIndex={isCompleted ? -1 : 0}
    >
      <div
        className={`flex flex-row justify-between h-full ${
          isCompleted ? 'pointer-events-none' : ''
        }`}
      >
        <div className='flex justify-start'>
          <div className='flex flex-row gap-3'>
            {(status === ContractClientMilestoneStatus.PendingApproval ||
              fundingStatus ===
                ContractClientMilestoneFundingStatus.pending) && (
              <div className='rounded-full border border-gray-300 p-2 w-8 h-8'>
                <Lock size={14} strokeWidth={3} stroke='#667085' />
              </div>
            )}
            {status === ContractClientMilestoneStatus.Completed && (
              <div className='bg-[#F3F3F9] rounded-full border border-[#E5E4F8] p-2 w-8 h-8'>
                <Check size={16} strokeWidth={4} stroke='#AA91EF' />{' '}
              </div>
            )}
            {status === ContractClientMilestoneStatus.InProgress && (
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
          <div className='flex flex-col justify-between h-full'>
            <div>
              <Badge
                variant={
                  status === ContractClientMilestoneStatus.InProgress
                    ? 'success'
                    : 'outline'
                }
              >
                {status}
              </Badge>
            </div>
            <div>
              {isClient &&
                status !== ContractClientMilestoneStatus.PendingApproval && (
                  <>
                    {fundingStatus ===
                    ContractClientMilestoneFundingStatus.funded ? (
                      <h2 className='text-center text-gray-400 font-medium'>
                        Funded
                      </h2>
                    ) : (
                      fundingStatus ===
                        ContractClientMilestoneFundingStatus.pending && (
                        <>
                          <Button
                            variant='default'
                            className={`bg-sorbet rounded-xl hover:bg-sorbet/70 ${
                              fundingButtonDisabled &&
                              `bg-sorbet/30 text-[#B39DEE] text-sorbet disabled`
                            }`}
                            size={`sm`}
                          >
                            Add Funds <Plus className='ml-1' size={17} />
                          </Button>
                        </>
                      )
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
