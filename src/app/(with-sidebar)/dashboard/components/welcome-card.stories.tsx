import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { WelcomeCard } from './welcome-card';

const meta = {
  title: 'Dashboard/WelcomeCard',
  component: WelcomeCard,
  parameters: {
    backgrounds: {
      default: 'white',
    },
  },
  args: {
    name: 'Rami',
    onDeposit: fn(),
    onSendFunds: fn(),
  },
} satisfies Meta<typeof WelcomeCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'Rami',
  },
};

export const NoName: Story = {
  args: {},
};

export const LongName: Story = {
  args: {
    name: 'Sir Maliketh Percival St. Joseph Vitricus Maximillian Oberon Von Callisto',
  },
};

export const LongNameNoSpaces: Story = {
  args: {
    name: 'Aunzaktaunzânzukt Zhazaktfumânz',
  },
};

export const LongNameNoSpacesUnrealistic: Story = {
  args: {
    name: 'Thisisverylongnamewithnospacesthatshouldnotbreakui',
  },
};
