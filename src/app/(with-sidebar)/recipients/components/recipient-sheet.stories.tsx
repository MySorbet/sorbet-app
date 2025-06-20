import { useArgs } from '@storybook/preview-api';
import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { mockRecipients } from '@/api/recipients/mock';
import { Button } from '@/components/ui/button';

import { RecipientSheet } from './recipient-sheet';

const meta = {
  title: 'Recipients/RecipientSheet',
  component: RecipientSheet,
  parameters: {
    layout: 'centered',
  },
  args: {
    onDelete: fn(),
    onSend: fn(),
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
        <RecipientSheet {...args} open={open} setOpen={setOpen} />
      </>
    );
  },
} satisfies Meta<typeof RecipientSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    recipient: mockRecipients[0],
  },
};

export const EUR: Story = {
  args: {
    recipient: mockRecipients[1],
  },
};

export const Crypto: Story = {
  args: {
    recipient: mockRecipients[2],
  },
};
