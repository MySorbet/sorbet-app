import { Meta, StoryObj } from '@storybook/react';

import { mockUser } from '@/api/user/mock-user';

import ProfilePage from './page';

type Story = StoryObj<typeof ProfilePage>;

const meta = {
  title: 'Profile/v2/Profile Page',
  component: ProfilePage,
  parameters: {
    layout: 'fullscreen',
    msw: {
      // handlers: [mockUserByHandleHandler], // Uncomment to use mock data. As is, this will hit the local api
    },
    localStorage: {
      user: mockUser,
    },
  },
} satisfies Meta<typeof ProfilePage>;

export default meta;

export const Default: Story = {
  args: {
    params: {
      handle: 'mock-user',
    },
  },
};
