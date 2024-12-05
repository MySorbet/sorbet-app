import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { ProfileEditModal } from '@/components/profile/profile-edit-modal';

const meta = {
  title: 'Profile/ProfileEditModal',
  component: ProfileEditModal,
  parameters: {
    layout: 'centered',
  },
  render: (args) => {
    return <ProfileEditModal {...args} />;
  },
} satisfies Meta<typeof ProfileEditModal>;

export default meta;

type Story = StoryObj<typeof meta>;

const mockData = {
  editModalVisible: true,
  handleModalVisible: fn(),
  user: {
    id: '123',
    firstName: 'Test',
    lastName: 'Test',
    privyId: '123',
    handle: 'apple-banana-mango',
    email: '',
    bio: '',
    city: 'New York',
    tags: ['JavaScript', 'React', 'Node.js'],
    profileImage: 'https://example.com/profile-image.jpg',
  },
};

export const Default: Story = {
  args: mockData,
};
