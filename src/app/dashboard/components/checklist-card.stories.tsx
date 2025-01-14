import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { ChecklistCard } from './checklist-card';

const meta = {
  title: 'Dashboard/ChecklistCard',
  component: ChecklistCard,
  args: {
    onTaskClick: fn(),
    onClose: fn(),
  },
} satisfies Meta<typeof ChecklistCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    completedTasks: {
      verified: true,
      invoice: true,
      profile: false,
      widget: false,
      share: false,
      payment: false,
    },
  },
};

export const AllTasksDone: Story = {
  args: {
    ...Default.args,
    completedTasks: {
      verified: true,
      invoice: true,
      profile: true,
      widget: true,
      share: true,
      payment: true,
    },
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    loading: true,
  },
};
