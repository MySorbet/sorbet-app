import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { TosIframe } from './tos-iframe';

type Story = StoryObj<typeof TosIframe>;

const meta = {
  title: 'Verify/TosIframe',
  component: TosIframe,
  parameters: {
    layout: 'centered',
  },
  args: {
    onAccept: fn(),
  },
  argTypes: {},
} satisfies Meta<typeof TosIframe>;

export default meta;

export const Default: Story = {
  args: {},
};
