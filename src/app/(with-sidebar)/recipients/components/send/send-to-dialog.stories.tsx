import { useArgs } from '@storybook/preview-api';
import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { mockRecipients } from '@/api/recipients/mock';
import { Button } from '@/components/ui/button';
import { sleep } from '@/lib/utils';

import { SendToDialog } from './send-to-dialog';

const meta = {
  title: 'Transfers/SendToDialog',
  component: SendToDialog,
  parameters: {
    layout: 'centered',
  },
  args: {
    onSend: fn(async () => {
      await sleep(3000);
    }),
    onAdd: fn(),
    open: true,
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
} satisfies Meta<typeof SendToDialog>;

export default meta;

type Story = StoryObj<typeof SendToDialog>;

export const Default: Story = {
  args: {
    maxAmount: 1000,
    recipients: mockRecipients,
  },
};

export const WithRecipient: Story = {
  args: {
    ...Default.args,
    selectedRecipientId: mockRecipients[0].id,
  },
};
