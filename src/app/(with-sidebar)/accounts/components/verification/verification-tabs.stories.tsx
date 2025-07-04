import { Meta, StoryObj } from '@storybook/react';

import { mockBridgeCustomer } from '@/api/bridge/mock-bridge-customer';

import { VerificationTabs } from './verification-tabs';

const meta = {
  title: 'Accounts/VerificationTabs',
  component: VerificationTabs,
  decorators: [
    (Story) => (
      <div className='size-[700px]'>
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof VerificationTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    selectedTab: 'terms',
    loading: false,
    tosUrl: mockBridgeCustomer.tos_link,
    kycUrl: mockBridgeCustomer.kyc_link,
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    loading: true,
  },
};
