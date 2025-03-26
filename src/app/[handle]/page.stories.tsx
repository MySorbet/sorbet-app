import { Meta, StoryObj } from '@storybook/react';

import { mockUserByHandleHandler } from '@/api/user/msw-handlers';
import { mockGetWidgetsHandler } from '@/api/widgets-v2/msw-handlers';

import ProfilePage from './page';

type Story = StoryObj<typeof ProfilePage>;

const meta = {
  title: 'Profile/Profile Page',
  component: ProfilePage,
  parameters: {
    layout: 'fullscreen',
    msw: {
      handlers: [mockUserByHandleHandler, mockGetWidgetsHandler], // Uncomment to use mock data. As is, this will hit the local api
    },
  },
  args: {
    params: {
      handle: 'mock-user',
    },
  },
  decorators: [
    (Story) => (
      <div className='h-screen'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProfilePage>;

export default meta;

export const Default: Story = {};
