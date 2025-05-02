import { Meta, StoryObj } from '@storybook/react';

import { handlers } from '@/api/recipients/msw';

import TransfersPage from './page';

const meta = {
  title: 'Transfers/Transfers Page',
  component: TransfersPage,
  parameters: {
    layout: 'fullscreen',
    msw: {
      handlers: [...handlers],
    },
  },
} satisfies Meta<typeof TransfersPage>;

export default meta;

type Story = StoryObj<typeof TransfersPage>;

// Currently, you will need to comment the authenticated wrapper to see the page
export const Default: Story = {};

export const DisableMSW: Story = {
  parameters: {
    msw: {
      handlers: [],
    },
  },
};
