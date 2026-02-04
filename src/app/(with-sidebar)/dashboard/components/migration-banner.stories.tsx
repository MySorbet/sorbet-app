import { fn } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react';

import { MigrationBanner } from './migration-banner';

const meta = {
  title: 'Dashboard/MigrationBanner',
  component: MigrationBanner,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof MigrationBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onComplete: fn(),
  },
};

/** Migration banner with custom onComplete handler */
export const WithCustomHandler: Story = {
  args: {
    onComplete: fn(),
  },
};

/** Migration banner without onComplete (uses router.push) */
export const WithoutHandler: Story = {
  args: {},
};
