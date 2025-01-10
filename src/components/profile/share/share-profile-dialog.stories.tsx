import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

import { ShareProfileDialog } from './share-profile-dialog';

const meta: Meta<typeof ShareProfileDialog> = {
  title: 'Profile/ShareProfileDialog',
  component: ShareProfileDialog,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    username: {
      control: 'text',
      defaultValue: 'mia-tanaka',
    },
    trigger: {
      table: {
        disable: true,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ShareProfileDialog>;

export const Default: Story = {
  args: {
    username: 'mia-tanaka',
    trigger: <Button>Open Dialog</Button>,
  },
};

export const WithManagedState: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <ShareProfileDialog
        {...args}
        open={open}
        setOpen={setOpen}
        {...Default.args}
      />
    );
  },
};
