import { Meta, StoryFn, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ComponentProps } from 'react';

import {
  mockUser,
  mockUserMinimal,
  mockUserWithProfileImage,
} from '@/api/user';
import { cn } from '@/lib/utils';

import { ProfileDetails } from './profile-details';

const sizeDecorator = (
  Story: StoryFn,
  {
    args,
  }: { args: ComponentProps<typeof ProfileDetails> & { desktop?: boolean } }
) => {
  return (
    <div className={cn('h-fit w-80', args.desktop && 'w-96')}>
      <Story />
    </div>
  );
};

const meta = {
  title: 'Profile/ProfileDetails',
  component: ProfileDetails,
  parameters: {
    layout: 'centered',
  },
  args: {
    onEdit: fn(),
  },
  decorators: [sizeDecorator],
} satisfies Meta<typeof ProfileDetails>;

export default meta;
type Story = StoryObj<typeof meta>;

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

export const Mine: Story = {
  args: {
    user: mockUser,
    isMine: true,
  },
};

export const WithoutNameAndBio: Story = {
  args: {
    user: mockUserMinimal,
    isMine: true,
  },
};

export const Desktop: Story = {
  args: {
    user: mockUser,
    desktop: true,
  },
};
