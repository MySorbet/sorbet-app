import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { ProfileEditModal } from '@/components/profile/profile-edit-modal';
import Providers from '@/app/providers';

const meta = {
  title: 'Profile Edit',
  component: ProfileEditModal,
  parameters: {
    layout: 'centered',
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => {
      return (
        <Providers>
          <Story />
        </Providers>
      );
    },
  ],
  render: (args) => {
    return <ProfileEditModal {...args} />;
  },
} satisfies Meta<typeof ProfileEditModal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    editModalVisible: true,
    handleModalVisible: fn(),
    user: {
      id: '123',
      firstName: 'Test',
      lastName: 'Test',
      privyId: '123',
      handle: 'apple-banana-mango',
      accountId: '123',
      email: '',
      bio: '',
      city: 'New York',
      tags: ['JavaScript', 'React', 'Node.js'],
      profileImage: 'https://example.com/profile-image.jpg',
      title: '',
      profileBannerImage: '',
      tempLocation: '',
    },
  },
};