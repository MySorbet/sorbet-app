import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { ClientSelector } from './client-selector';
import { Client } from './types';

const sampleClients: Client[] = [
  { id: '1', name: 'Acme Corp', email: 'acme@acme.com' },
  { id: '2', name: 'Wayne Enterprises', email: 'wayne@wayne.com' },
  { id: '3', name: 'Stark Industries', email: 'stark@stark.com' },
];

const meta = {
  title: 'Invoices/v2/ClientSelector',
  component: ClientSelector,
  parameters: {
    layout: 'centered',
  },
  args: {
    clients: sampleClients,
    onClientSelect: fn(),
    onAddClient: fn(),
  },
} satisfies Meta<typeof ClientSelector>;

export default meta;
type Story = StoryObj<typeof ClientSelector>;

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
