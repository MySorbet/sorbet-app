import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { mockBridgeCustomer } from '@/api/bridge/mock-bridge-customer';

import { TosIframe } from './tos-iframe';

type Story = StoryObj<typeof TosIframe>;

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

export const Default: Story = {};
