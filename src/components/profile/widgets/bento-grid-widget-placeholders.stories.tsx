import type { Meta, StoryObj } from '@storybook/react';

import { BentoGridWidgetPlaceholders } from './bento-grid-widget-placeholders';

const meta: Meta<typeof BentoGridWidgetPlaceholders> = {
  title: 'BentoGridWidgetPlaceholders',
  component: BentoGridWidgetPlaceholders,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof BentoGridWidgetPlaceholders>;

export const Default: Story = {};
