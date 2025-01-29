import { Meta, StoryObj } from '@storybook/react';

import { VerifyCard } from './verify-card';

const meta = {
  title: 'Verify/VerifyCard',
  component: VerifyCard,
} satisfies Meta<typeof VerifyCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <div>Hello</div>,
  },
};
