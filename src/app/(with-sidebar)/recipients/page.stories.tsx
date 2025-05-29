import { Meta, StoryObj } from '@storybook/react';

import { handlers } from '@/api/recipients/msw';

import RecipientsPage from './page';

const meta = {
  title: 'Transfers/Transfers Page',
  component: RecipientsPage,
  parameters: {
    layout: 'fullscreen',
    msw: {
      handlers: handlers(false),
    },
  },
} satisfies Meta<typeof RecipientsPage>;

export default meta;

type Story = StoryObj<typeof RecipientsPage>;

// Currently, you will need to comment the authenticated wrapper to see the page
export const Default: Story = {};

export const CreateRecipientFailure: Story = {
  parameters: {
    msw: {
      handlers: handlers(true),
    },
  },
};

export const DisableMSW: Story = {
  parameters: {
    msw: {
      handlers: [],
    },
  },
};
