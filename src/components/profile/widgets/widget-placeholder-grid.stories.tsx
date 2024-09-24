import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { WidgetPlaceholderGrid } from './widget-placeholder-grid';

const meta: Meta<typeof WidgetPlaceholderGrid> = {
  title: 'BentoGridWidgetPlaceholders',
  component: WidgetPlaceholderGrid,
  parameters: {
    layout: 'centered',
  },
  args: {
    onClick: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof WidgetPlaceholderGrid>;

export const Default: Story = {};
