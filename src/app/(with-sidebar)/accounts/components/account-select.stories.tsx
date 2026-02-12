import { fn } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react';

import { AccountSelect } from './account-select';

const meta = {
  title: 'Accounts/AccountSelect',
  component: AccountSelect,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    selected: {
      control: 'radio',
      options: ['usd', 'eur'],
    },
  },
} satisfies Meta<typeof AccountSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default state with no accounts enabled (both locked)
 */
export const NoAccountsEnabled: Story = {
  args: {
    selected: 'usd',
    onSelect: fn(),
    accounts: [],
  },
};

/**
 * Only USD account is enabled
 */
export const USDEnabled: Story = {
  args: {
    selected: 'usd',
    onSelect: fn(),
    accounts: [{ id: 'usd', state: 'available' }],
  },
};

/**
 * Only EUR account is enabled
 */
export const EUREnabled: Story = {
  args: {
    selected: 'eur',
    onSelect: fn(),
    accounts: [{ id: 'eur', state: 'available' }],
  },
};

/**
 * Both USD and EUR accounts are enabled
 */
export const BothEnabled: Story = {
  args: {
    selected: 'usd',
    onSelect: fn(),
    accounts: [
      { id: 'usd', state: 'available' },
      { id: 'eur', state: 'available' },
    ],
  },
};

/**
 * EUR account selected with both enabled
 */
export const EURSelected: Story = {
  args: {
    selected: 'eur',
    onSelect: fn(),
    accounts: [
      { id: 'usd', state: 'available' },
      { id: 'eur', state: 'available' },
    ],
  },
};
