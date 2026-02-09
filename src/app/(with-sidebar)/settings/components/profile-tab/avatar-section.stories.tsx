import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { AvatarSection } from './avatar-section';

const meta = {
  title: 'Settings/Profile/AvatarSection',
  component: AvatarSection,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AvatarSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    currentAvatar: 'https://github.com/shadcn.png',
    initials: 'JD',
    onAvatarChange: fn(),
    isUploading: false,
  },
};

export const NoAvatar: Story = {
  args: {
    currentAvatar: undefined,
    initials: 'AB',
    onAvatarChange: fn(),
    isUploading: false,
  },
};

export const Uploading: Story = {
  args: {
    currentAvatar: 'https://github.com/shadcn.png',
    initials: 'JD',
    onAvatarChange: fn(),
    isUploading: true,
  },
};
