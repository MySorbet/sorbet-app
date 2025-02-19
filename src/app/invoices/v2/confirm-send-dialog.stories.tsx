import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

import { ConfirmSendDialog } from './confirm-send-dialog';

const meta = {
  title: 'Invoices/V2/ConfirmSendDialog',
  component: ConfirmSendDialog,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ConfirmSendDialog>;

export default meta;
type Story = StoryObj<typeof ConfirmSendDialog>;

// Simulate API call with delay
const fakeSendInvoice = () =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, 2000);
  });

export const Default: Story = {
  args: {
    open: false,
    recipientEmail: 'client@example.com',
    onOpenChange: fn(),
    onConfirm: fn(),
    onBackToDashboard: fn(),
    isSending: false,
    hasSent: false,
  },
  render: function Render(args) {
    const [open, setOpen] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [hasSent, setHasSent] = useState(false);

    const handleSend = async () => {
      setIsSending(true);
      await fakeSendInvoice();
      setIsSending(false);
      setHasSent(true);
    };

    return (
      <div className='flex flex-col items-center gap-4'>
        <Button onClick={() => setOpen(true)}>Open Send Dialog</Button>

        <ConfirmSendDialog
          {...args}
          open={open}
          onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (!isOpen) {
              // Reset states when dialog closes
              setHasSent(false);
              setIsSending(false);
            }
          }}
          onConfirm={handleSend}
          isSending={isSending}
          hasSent={hasSent}
        />
      </div>
    );
  },
};

export const SendingState: Story = {
  args: {
    open: true,
    recipientEmail: 'client@example.com',
    onOpenChange: fn(),
    onConfirm: fn(),
    isSending: true,
    hasSent: false,
  },
};

export const SentState: Story = {
  args: {
    open: true,
    recipientEmail: 'client@example.com',
    onOpenChange: fn(),
    onConfirm: fn(),
    isSending: false,
    hasSent: true,
  },
};
