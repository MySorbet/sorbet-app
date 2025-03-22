import { Meta, StoryObj } from '@storybook/react';

import { mockUser } from '@/api/user';

import { Profile } from './profile';
import { WidgetProvider } from './widget/use-widget-context';

type Story = StoryObj<typeof Profile>;

const meta = {
  title: 'Profile/v2/Profile',
  component: Profile,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className='h-screen w-full'>
        <WidgetProvider>
          <Story />
        </WidgetProvider>
      </div>
    ),
  ],
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
    isLoggedIn: true,
  },
};

export const LoggedInNotMine: Story = {
  args: {
    user: mockUser,
    isMine: false,
    isLoggedIn: true,
  },
};

export const LoggedOut: Story = {
  args: {
    user: mockUser,
    isMine: false,
    isLoggedIn: false,
  },
};
