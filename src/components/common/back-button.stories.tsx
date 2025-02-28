import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { BackButton } from './back-button';

type Story = StoryObj<typeof BackButton>;

const meta = {
  title: 'Components/Common/BackButton',
  component: BackButton,
  parameters: {
    layout: 'centered',
  },
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof BackButton>;

export default meta;

/**
 * Default back button with text
 */
export const Default: Story = {
  args: {
    children: 'Back',
  },
};

/**
 * Back button without any text, just the icon
 */
export const IconOnly: Story = {
  args: {
    'aria-label': 'Go back',
  },
};
