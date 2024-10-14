import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import {
  ContractMilestone,
} from '@/app/gigs/contract/contract-milestone';
import { ContractMilestoneStatus } from '@/types';

const meta: Meta<typeof ContractMilestone> = {
  title: 'Gigs/ContractMilestone',
  component: ContractMilestone,
  argTypes: {
    handleMilestoneFunding: { action: 'funding' },
    handleMilestoneSubmission: { action: 'submission' },
    handleMilestoneApprove: { action: 'approve' },
  },
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => {
      return (
        <div className='w-[700px] bg-[#F2F2F2] px-4 py-3'>
          <Story />
        </div>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof ContractMilestone>;

export const Default: Story = {
  args: {
    isApproved: false,
    milestoneId: '1',
    status: ContractMilestoneStatus.Active,
    fundingButtonDisabled: false,
    title: 'Complete initial design',
    amount: 500,
    index: 0,
    projectId: 'project-123',
    isClient: true,
    handleMilestoneFunding: fn(),
    handleMilestoneSubmission: fn(),
    handleMilestoneApprove: fn(),
  },
};

export const Completed: Story = {
  args: {
    ...Default.args,
    status: ContractMilestoneStatus.Approved,
  },
};

export const InReview: Story = {
  args: {
    ...Default.args,
    status: ContractMilestoneStatus.InReview,
  },
};

export const FundingPending: Story = {
  args: {
    ...Default.args,
    status: ContractMilestoneStatus.FundingPending,
  },
};

export const FreelancerView: Story = {
  args: {
    ...Default.args,
    isClient: false,
  },
};

export const ApprovedMilestone: Story = {
  args: {
    ...Default.args,
    isApproved: true,
  },
};

export const FundingButtonDisabled: Story = {
  args: {
    ...Default.args,
    fundingButtonDisabled: true,
  },
};

export const LongTitle: Story = {
  args: {
    ...Default.args,
    title:
      'This is a very long milestone title that might wrap to multiple lines',
  },
};

export const LargeAmount: Story = {
  args: {
    ...Default.args,
    amount: 1000000,
  },
};

export const ClientFundingPending: Story = {
  args: {
    ...Default.args,
    isClient: true,
    status: ContractMilestoneStatus.FundingPending,
    isApproved: true,
  },
};
