import { useArgs } from '@storybook/preview-api';
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '@/components/ui/button';

import { StellarTrustlineDialog } from './stellar-trustline-dialog';

const meta = {
  title: 'Dashboard/StellarTrustlineDialog',
  component: StellarTrustlineDialog,
  parameters: {
    layout: 'centered',
  },
  args: {
    open: true,
    stellarAddress: 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF',
    onOpenChange: () => {},
    onTrustlineEstablished: () => {},
    establishTrustlineOverride: async () => {
      // Simulate async work.
      await new Promise((r) => setTimeout(r, 800));
    },
  },
} satisfies Meta<typeof StellarTrustlineDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: (args) => {
    const [{ open }, updateArgs] = useArgs();
    return (
      <>
        <Button onClick={() => updateArgs({ open: true })}>Open</Button>
        <StellarTrustlineDialog
          {...args}
          open={open}
          onOpenChange={(v) => updateArgs({ open: v })}
        />
      </>
    );
  },
};

