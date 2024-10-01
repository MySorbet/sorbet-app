import { Meta, StoryObj } from '@storybook/react';

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

// TODO: "My Sorbet QR Code" breaks the story because we need to mock RQ.
