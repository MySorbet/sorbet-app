import { Meta } from '@storybook/react';
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

export const Default = {
  args: {
    completedTasks: {
      verified: true,
      invoice: true,
    },
  },
};

export const AllTasksDone = {
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
