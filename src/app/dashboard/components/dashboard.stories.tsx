import { Meta, StoryObj } from '@storybook/react';

import {
  mockDashboardHandler,
  mockDashboardHandlerAllTasksComplete,
} from '@/api/dashboard/msw-handlers';
import { mockOverviewHandler } from '@/api/transactions';
import { mockUser } from '@/api/user';

import { Dashboard } from './dashboard';

const meta = {
  title: 'Dashboard/Dashboard',
  component: Dashboard,
} satisfies Meta<typeof Dashboard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Note: You must fake the return values of useSmartWalletAddress stories rendering transaction cards to render properly

export const Default: Story = {};

export const WithMockData: Story = {
  parameters: {
    msw: [mockDashboardHandler],
  },
};

export const AllTasksCompleteMockData: Story = {
  parameters: {
    msw: [mockDashboardHandlerAllTasksComplete, mockOverviewHandler],
  },
};

export const AllTasksCompleteMockDataAndShared: Story = {
  parameters: {
    msw: [mockDashboardHandlerAllTasksComplete, mockOverviewHandler],
    localStorage: {
      [`sorbet:has-shared:${mockUser.id}`]: true,
    },
  },
};

export const AllTasksCompleteMockDataAndTasksClosed: Story = {
  parameters: {
    msw: [mockDashboardHandlerAllTasksComplete, mockOverviewHandler],
    localStorage: {
      [`sorbet:has-shared:${mockUser.id}`]: true,
      [`sorbet:is-tasks-closed:${mockUser.id}`]: true,
    },
  },
};
