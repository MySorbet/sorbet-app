import { useArgs } from '@storybook/preview-api';
import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { Button } from '@/components/ui/button';

import { ClientSheet } from './client-sheet';

const meta = {
  title: 'Invoices/V2/ClientSheet',
  component: ClientSheet,
  parameters: {
    layout: 'centered',
  },
  render: (args) => {
    const [{ open }, updateArgs] = useArgs();
    const handleSetOpen = (open: boolean) => {
      updateArgs({ open });
    };
    return (
      <>
        <Button onClick={() => updateArgs({ open: true })}>Open</Button>
        <ClientSheet {...args} open={open} setOpen={handleSetOpen} />
      </>
    );
  },
  args: {
    open: true,
    setOpen: fn(),
    client: {
      id: '1',
      name: 'Acme Corp',
      email: 'billing@acme.com',
      address: {
        street: '123 Business St',
        city: 'Anytown',
        state: 'CA',
        zip: '12345',
        country: 'USA',
      },
    },
  },
} satisfies Meta<typeof ClientSheet>;

export default meta;
type Story = StoryObj<typeof ClientSheet>;

export const Default: Story = {};

export const EmptyClient: Story = {
  args: {
    client: {
      id: '',
      name: '',
      email: '',
      address: {
        street: '',
        city: '',
        state: '',
        zip: '',
        country: '',
      },
    },
  },
};

export const EditingClient: Story = {
  args: {
    client: {
      id: '2',
      name: 'Globex Corporation',
      email: 'accounts@globex.com',
      address: {
        street: '456 Corporate Ave',
        city: 'Anytown',
        state: 'CA',
        zip: '12345',
        country: 'USA',
      },
    },
  },
};

export const Saving: Story = {
  args: {
    isSaving: true,
  },
};
