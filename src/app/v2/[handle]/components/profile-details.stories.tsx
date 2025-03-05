import { Meta, StoryObj } from '@storybook/react';

import { mockUser, mockUserWithProfileImage } from '@/api/user';

import { ProfileDetails } from './profile-details';

type Story = StoryObj<typeof ProfileDetails>;

const meta = {
  title: 'Profile/v2/ProfileDetails',
  component: ProfileDetails,
  parameters: {
    layout: 'centered',
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
