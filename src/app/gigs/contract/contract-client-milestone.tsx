import { useWalletSelector } from '@/components/common/near-wallet/walletSelectorContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks';
import { ContractMilestoneStatus } from '@/types';
import { Check, Lock, Plus, Zap } from 'lucide-react';
import React from 'react';

export interface ContractClientMilestoneProps {
  isApproved?: boolean;
  status: ContractMilestoneStatus;
  fundingButtonDisabled?: boolean;
  title: string;
  amount: number;
  index: number;
}

export const ContractClientMilestone = ({
  isApproved = false,
  status,
  fundingButtonDisabled = false,
  title,
  amount,
  index,
}: ContractClientMilestoneProps) => {
  const isCompleted = status === ContractMilestoneStatus.Approved;
  const { accounts, selector } = useWalletSelector();
  const { user } = useAuth();
  const { toast } = useToast();

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

  const handleMilestoneFunding = async () => {
    if (accounts.length > 0) {
      if (user?.balance?.usdc && user?.balance?.usdc >= amount) {
        const wallet = await selector.wallet();
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
            {status === ContractMilestoneStatus.Active && (
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
                  status === ContractMilestoneStatus.Active
                    ? 'success'
                    : 'outline'
                }
              >
                {mapStatusLabel()}
              </Badge>
            </div>
            <div>
              {status === ContractMilestoneStatus.Active && (
                <h2 className='text-center text-gray-400 font-medium'>
                  Funded
                </h2>
              )}
              {status === ContractMilestoneStatus.FundingPending && (
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
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
