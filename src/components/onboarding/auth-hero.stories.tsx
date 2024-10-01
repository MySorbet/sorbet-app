import type { Meta, StoryObj } from '@storybook/react';

import { AuthHero } from './auth-hero';

const meta: Meta<typeof AuthHero> = {
  title: 'Onboarding/AuthHero',
  component: AuthHero,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof AuthHero>;

export const Default: Story = {};
