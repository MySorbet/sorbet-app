import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { Client } from '../../schema';
import { ClientCard } from './client-card';

const sampleClients: Client[] = [
  { id: '1', name: 'Acme Corp', email: 'acme@acme.com' },
  { id: '2', name: 'Wayne Enterprises', email: 'wayne@wayne.com' },
  { id: '3', name: 'Stark Industries', email: 'stark@stark.com' },
];

const meta = {
  title: 'Invoices/ClientCard',
  component: ClientCard,
  parameters: {
    layout: 'centered',
  },
  args: {
    clients: sampleClients,
    onClientSelect: fn(),
    onAddClient: fn(),
    onEditClient: fn(),
  },
} satisfies Meta<typeof ClientCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const EmptyList: Story = {
  args: {
    clients: [],
  },
};

export const SingleClient: Story = {
  args: {
    clients: [sampleClients[0]],
  },
};

export const WithSelectedClient: Story = {
  args: {
    clients: sampleClients,
    selectedClient: sampleClients[0],
  },
};
