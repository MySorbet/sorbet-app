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
      <WidgetProvider>
        <Story />
      </WidgetProvider>
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
  },
};
