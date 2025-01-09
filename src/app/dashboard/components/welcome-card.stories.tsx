import { Meta } from '@storybook/react';
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

export const Default = {
  args: {},
};

export const LongName = {
  args: {
    name: 'Sir Maliketh Percival St. Joseph Vitricus Maximillian Oberon Von Callisto',
  },
};

export const LongNameNoSpaces = {
  args: {
    name: 'Aunzaktaunzânzukt Zhazaktfumânz',
  },
};

export const LongNameNoSpacesUnrealistic = {
  args: {
    name: 'Thisisverylongnamewithnospacesthatshouldnotbreakui',
  },
};
