import { Meta, StoryObj } from '@storybook/react';

import TransfersPage from './page';

const meta = {
  title: 'Transfers/Transfers Page',
  component: TransfersPage,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof TransfersPage>;

export default meta;

type Story = StoryObj<typeof TransfersPage>;

export const Default: Story = {};

// Currently, you will need to comment the authenticated wrapper to see the page
