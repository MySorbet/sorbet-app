import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { OnboardingDrawer } from './onboarding-drawer';

const meta: Meta<typeof OnboardingDrawer> = {
  title: 'OnboardingDrawer',
  component: OnboardingDrawer,
  parameters: {
    layout: 'centered',
  },
  args: {
    onSubmit: fn(),
    open: true,
  },
};

export default meta;

type Story = StoryObj<typeof OnboardingDrawer>;

// TODO: How to make click off and skip affect the control?
export const Default: Story = {};
