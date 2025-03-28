import { Meta, StoryObj } from '@storybook/react';

import { ExitLinks } from './exit-links';

const meta = {
  title: 'Profile/ExitLinks',
  parameters: {
    layout: 'centered',
  },
  component: ExitLinks,
} satisfies Meta<typeof ExitLinks>;

export default meta;

type Story = StoryObj<typeof ExitLinks>;

export const Default: Story = {
  args: {
    isLoggedIn: false,
    isMine: false,
  },
};

export const LoggedIn: Story = {
  args: {
    isLoggedIn: true,
    isMine: false,
    handle: 'mock-user',
  },
};

export const Mine: Story = {
  args: {
    isLoggedIn: true,
    isMine: true,
    handle: 'mock-user',
  },
};
