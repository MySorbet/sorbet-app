import { Meta, StoryObj } from '@storybook/react';

import { mockBridgeCustomerHandler } from '@/api/bridge';

import { YourEndorsements } from './your-endorsements';

const meta = {
  title: 'YourEndorsements',
  component: YourEndorsements,
  parameters: {
    layout: 'centered',
    msw: {
      handlers: [mockBridgeCustomerHandler],
    },
  },
} satisfies Meta<typeof YourEndorsements>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
