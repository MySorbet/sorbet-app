import { Meta, StoryObj } from '@storybook/react';

import { mockUser, mockUserByHandleHandler } from '@/api/user';
import {
  mockGetWidgetsHandler,
  mockUpdateWidgetHandler,
} from '@/api/widgets-v2';

import { Profile } from './profile';
import { WidgetProvider } from './widget/use-widget-context';
type Story = StoryObj<typeof Profile>;

const meta = {
  title: 'Profile/Profile',
  component: Profile,
  parameters: {
    layout: 'fullscreen',
    // Comment MSW to hit the local API
    msw: {
      handlers: [
        mockUserByHandleHandler,
        mockGetWidgetsHandler,
        mockUpdateWidgetHandler,
      ],
    },
  },
  decorators: [
    (Story) => (
      <div className='h-screen w-full'>
        <WidgetProvider userId={mockUser.id}>
          <Story />
        </WidgetProvider>
      </div>
    ),
  ],
} satisfies Meta<typeof Profile>;

export default meta;

export const Default: Story = {
  name: 'Default (Logged out)',
  args: {
    user: mockUser,
  },
};

export const LoggedIn: Story = {
  args: {
    user: mockUser,
    isMine: false,
    isLoggedIn: true,
  },
};

export const Mine: Story = {
  args: {
    user: mockUser,
    isMine: true,
    isLoggedIn: true,
  },
};
