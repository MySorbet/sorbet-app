import { useArgs } from '@storybook/preview-api';
import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { mockRecipients } from '@/api/recipients/mock';
import { Button } from '@/components/ui/button';

import { SendToDialog } from './send-to-dialog';

const meta = {
  title: 'Transfers/SendToCard',
  component: SendToDialog,
  parameters: {
    layout: 'centered',
  },
  args: {
    onSend: fn(),
    onAdd: fn(),
  },
} satisfies Meta<typeof SendToDialog>;

export default meta;

type Story = StoryObj<typeof SendToDialog>;

export const Default: Story = {
  args: {
    maxAmount: 1000,
    recipients: mockRecipients,
  },
  render: (args) => {
    const [{ open }, setArgs] = useArgs();
    const setOpen = (open: boolean) => setArgs({ open });
    return (
      <>
        <Button variant='sorbet' size='sm' onClick={() => setOpen(true)}>
          Open
        </Button>
        <SendToDialog {...args} open={open} setOpen={setOpen} />
      </>
    );
  },
};
