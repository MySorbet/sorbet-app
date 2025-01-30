import { Meta, StoryObj } from '@storybook/react';

import { VerifyDashboard } from './verify-dashboard';

type Story = StoryObj<typeof VerifyDashboard>;

const meta = {
  title: 'Verify/VerifyDashboard',
  component: VerifyDashboard,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof VerifyDashboard>;

export default meta;

export const Default: Story = {};
