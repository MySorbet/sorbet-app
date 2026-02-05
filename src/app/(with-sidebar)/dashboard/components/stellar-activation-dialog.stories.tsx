import { useArgs } from '@storybook/preview-api';
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '@/components/ui/button';

import { StellarActivationDialog } from './stellar-activation-dialog';

const meta = {
  title: 'Dashboard/StellarActivationDialog',
  component: StellarActivationDialog,
  parameters: {
    layout: 'centered',
  },
  args: {
    open: true,
    // Valid-looking Stellar public key format (G...).
    stellarAddress: 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF',
    onOpenChange: () => {},
    onRetrySwitch: async () => {},
  },
} satisfies Meta<typeof StellarActivationDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: (args) => {
    const [{ open }, updateArgs] = useArgs();
    return (
      <>
        <Button onClick={() => updateArgs({ open: true })}>Open</Button>
        <StellarActivationDialog
          {...args}
          open={open}
          onOpenChange={(v) => updateArgs({ open: v })}
        />
      </>
    );
  },
};

