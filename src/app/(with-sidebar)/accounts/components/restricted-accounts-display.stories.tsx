import type { Meta, StoryObj } from '@storybook/react';

import { RestrictedAccountsDisplay } from './restricted-accounts-display';

const meta = {
  title: 'Accounts/RestrictedAccountsDisplay',
  component: RestrictedAccountsDisplay,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof RestrictedAccountsDisplay>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Display for users from restricted countries showing all accounts as "Coming Soon"
 */
export const Default: Story = {};
