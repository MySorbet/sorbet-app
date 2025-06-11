import type { Meta, StoryObj } from '@storybook/react';

import { FAQ } from './faq';

const meta = {
  title: 'Verify/FAQ',
  component: FAQ,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof FAQ>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
