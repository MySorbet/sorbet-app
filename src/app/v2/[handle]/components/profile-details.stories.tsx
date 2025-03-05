import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { mockUser, mockUserWithProfileImage } from '@/api/user';

import { ProfileDetails } from './profile-details';

type Story = StoryObj<typeof ProfileDetails>;

const meta = {
  title: 'Profile/v2/ProfileDetails',
  component: ProfileDetails,
  parameters: {
    layout: 'centered',
  },
  args: {
    onEdit: fn(),
  },
} satisfies Meta<typeof ProfileDetails>;

export default meta;

export const Default: Story = {
  args: {
    user: mockUser,
  },
};

export const WithProfileImage: Story = {
  args: {
    user: mockUserWithProfileImage,
  },
};

export const Mine: Story = {
  args: {
    user: mockUser,
    isMine: true,
  },
};
