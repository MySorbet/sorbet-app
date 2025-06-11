import { useArgs } from '@storybook/preview-api';
import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { mockUser } from '@/api/user';

import { EditProfileSheet } from './edit-profile-sheet';

const meta = {
  title: 'Profile/EditProfileSheet',
  component: EditProfileSheet,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof EditProfileSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [{ open }, setArgs] = useArgs();
    return (
      <EditProfileSheet
        {...args}
        open={open}
        setOpen={(open) => setArgs({ open })}
      />
    );
  },
  args: {
    open: true,
    setOpen: fn(),
    user: mockUser,
  },
};
