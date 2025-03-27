import { Meta, StoryObj } from '@storybook/react';

import { mockUserByHandleHandler } from '@/api/user';
import {
  mockGetWidgetsHandler,
  mockUpdateWidgetHandler,
} from '@/api/widgets-v2';

import ProfilePage from './page';

type Story = StoryObj<typeof ProfilePage>;

const meta = {
  title: 'Profile/Profile Page',
  component: ProfilePage,
  parameters: {
    layout: 'fullscreen',
    // Uncomment to use mock data. As is, this will hit the local api
    msw: {
      handlers: [
        mockUserByHandleHandler,
        mockGetWidgetsHandler,
        mockUpdateWidgetHandler,
      ],
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
