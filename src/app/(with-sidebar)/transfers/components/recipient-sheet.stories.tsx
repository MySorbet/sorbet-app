import { Meta, StoryObj } from '@storybook/react';

import { RecipientSheet } from './recipient-sheet';

const meta = {
  title: 'Transfers/RecipientSheet',
  component: RecipientSheet,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof RecipientSheet>;

export default meta;

type Story = StoryObj<typeof RecipientSheet>;

export const Default: Story = {};
