import { Meta, StoryObj } from '@storybook/react';

import { DashboardCard } from './dashboard-card';

const meta = {
  title: 'Dashboard/DashboardCards',
  component: DashboardCard,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'white',
    },
  },
} satisfies Meta<typeof DashboardCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'I am a dashboard card',
  },
};
