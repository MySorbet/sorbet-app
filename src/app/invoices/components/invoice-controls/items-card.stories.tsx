import { type Meta, type StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { ItemsCard } from './items-card';

const meta = {
  title: 'Invoices/ItemsCard',
  component: ItemsCard,
  parameters: {
    layout: 'centered',
  },
  args: {
    items: [
      {
        name: 'Website Development',
        quantity: 1,
        amount: 1000,
      },
      {
        name: 'UI/UX Design',
        quantity: 2,
        amount: 500,
      },
    ],
    onItemsChange: fn(),
  },
} satisfies Meta<typeof ItemsCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    items: [
      {
        name: '',
        quantity: 0,
        amount: 0,
      },
    ],
  },
};

export const SingleItem: Story = {
  args: {
    items: [
      {
        name: 'Consulting Services',
        quantity: 1,
        amount: 750,
      },
    ],
  },
};

export const MultipleItems: Story = {
  args: {
    items: [
      {
        name: 'Web Development',
        quantity: 1,
        amount: 2000,
      },
      {
        name: 'Content Writing',
        quantity: 3,
        amount: 300,
      },
      {
        name: 'SEO Optimization',
        quantity: 1,
        amount: 500,
      },
    ],
  },
};
