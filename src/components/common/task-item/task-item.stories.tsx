import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { FileText } from 'lucide-react';

import { TaskItem } from './task-item';

type Story = StoryObj<typeof TaskItem>;

const meta = {
  title: 'Components/common/TaskItem',
  component: TaskItem,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    title: 'Complete your profile',
    description: 'Add your personal information to get started',
    Icon: FileText,
    completed: false,
    onClick: fn(),
  },
  decorators: [
    (Story) => (
      <div className='w-[400px]'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TaskItem>;

export default meta;

export const Default: Story = {};

export const Completed: Story = {
  args: {
    completed: true,
  },
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const LongContent: Story = {
  args: {
    title: 'This is a very long task title that might wrap to multiple lines',
    description:
      'This is a very long task description that demonstrates how the component handles longer content and wrapping behavior in a realistic scenario',
  },
};
