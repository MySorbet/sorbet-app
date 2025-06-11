import { Meta, StoryObj } from '@storybook/react';

import { mockUser, mockUserByHandleHandler } from '@/api/user';
import {
  mockCreateWidgetHandler,
  mockDeleteWidgetHandler,
  mockGetWidgetsHandler,
  mockImageUploadHandler,
  mockUpdateLayoutsHandler,
  mockUpdateWidgetHandler,
} from '@/api/widgets-v2';

import { Profile } from './profile';
import { WidgetProvider } from './widget/use-widget-context';

const meta = {
  title: 'Profile/Profile',
  component: Profile,
  parameters: {
    layout: 'fullscreen',
    msw: {
      handlers: [
        mockUserByHandleHandler,
        mockGetWidgetsHandler,
        mockUpdateWidgetHandler,
        mockImageUploadHandler,
        mockUpdateLayoutsHandler,
        mockCreateWidgetHandler,
        mockDeleteWidgetHandler,
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
type Story = StoryObj<typeof meta>;

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

export const MineDisableMSW: Story = {
  name: 'Mine (Disable MSW)',
  parameters: {
    msw: {
      handlers: [],
    },
  },
  args: {
    user: mockUser,
    isMine: true,
    isLoggedIn: true,
  },
};
