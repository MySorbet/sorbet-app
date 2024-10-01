import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '@/components/ui/button';

import { OnboardingShell } from './onboarding-shell';

const meta: Meta<typeof OnboardingShell> = {
  title: 'Onboarding/OnboardingShell',
  component: OnboardingShell,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof OnboardingShell>;

export const Default: Story = {
  args: {
    children: <div>Onboarding Content</div>,
  },
};

export const WithUnderAuthHeroContent: Story = {
  args: {
    children: <div>Onboarding Content</div>,
    renderUnderAuthHero: () => <Button>Underneath</Button>,
  },
};
