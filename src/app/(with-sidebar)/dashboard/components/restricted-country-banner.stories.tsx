import type { Meta, StoryObj } from '@storybook/react';

import { RestrictedCountryBanner } from './restricted-country-banner';

const meta = {
  title: 'Dashboard/RestrictedCountryBanner',
  component: RestrictedCountryBanner,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof RestrictedCountryBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
