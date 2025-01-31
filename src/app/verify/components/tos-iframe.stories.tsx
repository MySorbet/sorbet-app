import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { TosIframe } from './tos-iframe';
import { TOS_URL } from './urls';

type Story = StoryObj<typeof TosIframe>;

const meta = {
  title: 'Verify/TosIframe',
  component: TosIframe,
  parameters: {
    layout: 'centered',
  },
  args: {
    url: TOS_URL,
    onComplete: fn(),
  },
} satisfies Meta<typeof TosIframe>;

export default meta;

export const Default: Story = {};
