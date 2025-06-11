import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { KYCChecklist } from './kyc-checklist';

const meta = {
  title: 'Verify/KYCChecklist',
  component: KYCChecklist,
  parameters: {
    layout: 'centered',
  },
  args: {
    onTaskClick: fn(),
    completedTasks: {
      terms: false,
      details: false,
    },
  },
} satisfies Meta<typeof KYCChecklist>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    completedTasks: {
      terms: false,
      details: false,
    },
  },
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const PartiallyComplete: Story = {
  args: {
    completedTasks: {
      terms: true,
      details: false,
    },
  },
};

export const Complete: Story = {
  args: {
    completedTasks: {
      terms: true,
      details: true,
    },
  },
};

export const Indeterminate: Story = {
  args: {
    indeterminate: true,
  },
};
