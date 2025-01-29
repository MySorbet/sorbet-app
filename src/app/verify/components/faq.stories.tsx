import type { Meta, StoryObj } from '@storybook/react';

import { FAQ } from './faq';

type Story = StoryObj<typeof FAQ>;

const meta = {
  title: 'Verify/FAQ',
  component: FAQ,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof FAQ>;

export default meta;

export const Default: Story = {};
