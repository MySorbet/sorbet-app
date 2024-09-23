import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { WidgetTypes } from '@/types';

import { WidgetPlaceHolder } from './widget-placeholder';

const meta = {
  title: 'WidgetPlaceholder',
  component: WidgetPlaceHolder,
  parameters: {
    layout: 'centered',
  },
  args: {
    onClick: fn(),
  },
  argTypes: {
    type: {
      options: WidgetTypes,
      control: {
        type: 'select',
      },
    },
  },
} satisfies Meta<typeof WidgetPlaceHolder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    type: 'TwitterProfile',
    size: 'A',
  },
};

export const B: Story = {
  args: {
    type: 'TwitterProfile',
    size: 'B',
  },
};

export const C: Story = {
  args: {
    type: 'TwitterProfile',
    size: 'C',
  },
};

export const D: Story = {
  args: {
    type: 'TwitterProfile',
    size: 'D',
  },
};
