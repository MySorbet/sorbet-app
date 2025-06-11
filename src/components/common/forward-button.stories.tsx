import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { ForwardButton } from './forward-button';

const meta = {
  title: 'Components/Common/ForwardButton',
  component: ForwardButton,
  parameters: {
    layout: 'centered',
  },
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof ForwardButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default forward button with text
 */
export const Default: Story = {
  args: {
    children: 'Continue',
  },
};

/**
 * Forward button in loading state
 */
export const Loading: Story = {
  args: {
    children: 'Continue',
    isLoading: true,
  },
};
