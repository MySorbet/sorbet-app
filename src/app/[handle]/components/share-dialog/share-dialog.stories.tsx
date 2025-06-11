import { useArgs } from '@storybook/preview-api';
import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { Button } from '@/components/ui/button';

import { ShareDialog } from './share-dialog';

const meta = {
  title: 'Profile/ShareDialog',
  component: ShareDialog,
  parameters: {
    layout: 'centered',
  },
  args: {
    open: true,
    setOpen: fn(),
  },
  render: (args) => {
    const [{ open }, updateArgs] = useArgs();
    const handleSetOpen = (open: boolean) => {
      updateArgs({ open });
    };
    return (
      <>
        <Button onClick={() => updateArgs({ open: true })}>Open</Button>
        <ShareDialog {...args} open={open} setOpen={handleSetOpen} />
      </>
    );
  },
} satisfies Meta<typeof ShareDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
