import { useArgs } from '@storybook/preview-api';
import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { Button } from '@/components/ui/button';

import { RecipientSheet } from './recipient-sheet';
import { debugToast } from './story-utils';

const meta = {
  title: 'Transfers/RecipientSheet',
  component: RecipientSheet,
  parameters: {
    layout: 'centered',
  },
  args: {
    onSubmit: fn(debugToast),
  },
  argTypes: {
    setOpen: {
      table: {
        disable: true,
      },
    },
    onSubmit: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof RecipientSheet>;

export default meta;

type Story = StoryObj<typeof RecipientSheet>;

export const Default: Story = {
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
