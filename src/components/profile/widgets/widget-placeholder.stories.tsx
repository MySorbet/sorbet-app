import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { WidgetTypesWithIcons } from '@/components/profile/widgets/widget-icon';

import { WidgetPlaceholder } from './widget-placeholder';

const meta = {
  title: 'WidgetPlaceholder',
  component: WidgetPlaceholder,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onClick: fn(),
  },
  argTypes: {
    type: {
      options: WidgetTypesWithIcons,
      control: {
        type: 'select',
      },
    },
  },
} satisfies Meta<typeof WidgetPlaceholder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    type: 'Behance',
  },
};
