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
    onCreateInvoice: fn(),
    onClickMyProfile: fn(),
  },
} satisfies Meta<typeof WelcomeCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
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
