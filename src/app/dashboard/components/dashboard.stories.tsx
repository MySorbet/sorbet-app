import { Meta } from '@storybook/react';

import { mockDashboardHandler } from '@/api/dashboard/msw-handlers';

import { Dashboard } from './dashboard';

const meta = {
  title: 'Dashboard/Dashboard',
  component: Dashboard,
} satisfies Meta<typeof Dashboard>;

export default meta;

export const Default = {};

export const WithMockData = {
  parameters: {
    msw: [mockDashboardHandler],
  },
};
