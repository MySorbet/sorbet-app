import type { Meta, StoryObj } from '@storybook/react';

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
  },
} satisfies Meta<typeof TosIframe>;

export default meta;

export const Default: Story = {};
