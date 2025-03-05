import { Meta, StoryObj } from '@storybook/react';

import { mockUserByHandleHandler } from '@/api/user/msw-handlers';

import ProfilePage from './page';

type Story = StoryObj<typeof ProfilePage>;

const meta = {
  title: 'Profile/v2/Profile Page',
  component: ProfilePage,
  parameters: {
    layout: 'fullscreen',
    msw: {
      handlers: [mockUserByHandleHandler],
    },
  },
} satisfies Meta<typeof ProfilePage>;

export default meta;

export const Default: Story = {
  args: {
    params: {
      handle: 'cutaiar',
    },
  },
};
