import { useArgs } from '@storybook/preview-api';
import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { mockRecipients } from '@/api/recipients/mock';
import { Button } from '@/components/ui/button';

import { RecipientSheet } from './recipient-sheet';

const meta = {
  title: 'Transfers/RecipientSheet',
  component: RecipientSheet,
  parameters: {
    layout: 'centered',
  },
  args: {
    onDelete: fn(),
  },
} satisfies Meta<typeof RecipientSheet>;

export default meta;

type Story = StoryObj<typeof RecipientSheet>;

export const Default: Story = {
  args: {
    recipient: mockRecipients[0],
  },
  render: (args) => {
    const [{ open }, setArgs] = useArgs();
    const setOpen = (open: boolean) => setArgs({ open });
    return (
      <>
        <Button variant='sorbet' size='sm' onClick={() => setOpen(true)}>
          Open
        </Button>
        <RecipientSheet {...args} open={open} setOpen={setOpen} />
      </>
    );
  },
};
