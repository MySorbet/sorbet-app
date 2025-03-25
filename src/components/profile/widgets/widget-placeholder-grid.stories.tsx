import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { WidgetPlaceholderGrid } from './widget-placeholder-grid';

const meta: Meta<typeof WidgetPlaceholderGrid> = {
  title: 'Profile/deprecated/WidgetPlaceholderGrid',
  component: WidgetPlaceholderGrid,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    onClick: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof WidgetPlaceholderGrid>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    loading: true,
  },
};
