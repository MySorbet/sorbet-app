import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { AddWidgets } from './add-widgets';

const meta = {
  title: 'AddWidgets',
  component: AddWidgets,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    addUrl: fn(),
  },
} satisfies Meta<typeof AddWidgets>;

export default meta;
type Story = StoryObj<typeof AddWidgets>;

export const Default: Story = {};
