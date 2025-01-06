import { Meta } from '@storybook/react';

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

export const Default = () => {
  return <DashboardCard>I'm a dashboard card</DashboardCard>;
};
