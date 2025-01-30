import { Meta, StoryObj } from '@storybook/react';

import VerifyPage from '@/app/verify/page';

type Story = StoryObj<typeof VerifyPage>;

const meta = {
  title: 'Verify/VerifyPage',
  component: VerifyPage,
} satisfies Meta<typeof VerifyPage>;

export default meta;

export const Default: Story = {};
