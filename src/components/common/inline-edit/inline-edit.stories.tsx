import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { InlineEdit } from './inline-edit';

const meta = {
  title: 'Components/common/InlineEdit',
  component: InlineEdit,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className='border-border w-40 rounded-md border-2 border-dashed p-2'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InlineEdit>;

export default meta;
type Story = StoryObj<typeof InlineEdit>;

export const Default: Story = {
  args: {
    value: 'Click to edit',
    onChange: fn(),
    editable: true,
    placeholder: 'Enter text',
  },
};

export const ReadOnly: Story = {
  args: {
    value: 'This text cannot be edited',
    onChange: fn(),
    editable: false,
  },
};

export const Empty: Story = {
  args: {
    value: '',
    onChange: fn(),
    editable: true,
    placeholder: 'Empty state with placeholder',
  },
};
