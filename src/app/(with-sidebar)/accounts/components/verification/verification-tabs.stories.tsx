import { Meta, StoryObj } from '@storybook/react';

import { VerificationTabs } from './verification-tabs';

const meta = {
  title: 'VerificationTabs',
  component: VerificationTabs,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof VerificationTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
