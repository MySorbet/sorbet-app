import { Meta, StoryObj } from '@storybook/react';

import { AccountVerificationCard } from './account-verification-card';

const meta = {
  title: 'Verify/Account Verification Card',
  component: AccountVerificationCard,
} satisfies Meta<typeof AccountVerificationCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
