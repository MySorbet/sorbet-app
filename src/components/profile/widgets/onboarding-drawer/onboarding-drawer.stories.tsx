import { useArgs } from '@storybook/preview-api';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { OnboardingDrawer } from './onboarding-drawer';

const meta: Meta<typeof OnboardingDrawer> = {
  title: 'Widgets/OnboardingDrawer',
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

export const Default: Story = {
  render: (args) => {
    // This is some SB boiler plate to sync the control with drawer state
    const [{ open }, updateArgs] = useArgs();
    const handleClose = () => {
      updateArgs({ open: false });
    };

    return <OnboardingDrawer {...args} open={open} onClose={handleClose} />;
  },
};
