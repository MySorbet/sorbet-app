import { Meta, StoryObj } from '@storybook/react';

import { mockDashboardHandler } from '@/api/dashboard/msw-handlers';

import { Dashboard } from './dashboard';

const meta = {
  title: 'Dashboard/Dashboard',
  component: Dashboard,
} satisfies Meta<typeof Dashboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithMockData: Story = {
  parameters: {
    msw: [mockDashboardHandler],
  },
};
