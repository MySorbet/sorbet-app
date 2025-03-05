import { Meta, StoryObj } from '@storybook/react';

import { mockUser } from '@/api/user';

import { Profile } from './profile';

type Story = StoryObj<typeof Profile>;

const meta = {
  title: 'Profile/v2/Profile',
  component: Profile,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Profile>;

export default meta;

export const Default: Story = {
  args: {
    user: mockUser,
  },
};

export const Mine: Story = {
  args: {
    user: mockUser,
    isMine: true,
  },
};
