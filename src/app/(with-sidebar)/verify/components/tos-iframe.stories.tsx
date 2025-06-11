import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { mockBridgeCustomer } from '@/api/bridge/mock-bridge-customer';

import { TosIframe } from './tos-iframe';

const meta = {
  title: 'Verify/TosIframe',
  component: TosIframe,
  parameters: {
    layout: 'centered',
  },
  args: {
    url: mockBridgeCustomer.tos_link,
    onComplete: fn(),
  },
} satisfies Meta<typeof TosIframe>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = {
  render: (args) => {
    return <TosIframe {...args} className='h-[20rem] w-[20rem]' />;
  },
};
