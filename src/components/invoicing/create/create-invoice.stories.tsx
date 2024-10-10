import type { Meta, StoryObj } from '@storybook/react';

import { CreateInvoice } from './create-invoice';

const meta: Meta<typeof CreateInvoice> = {
  title: 'Invoicing/CreateInvoice',
  component: CreateInvoice,
  parameters: {
    layout: 'centered',
  },
  args: {
    step: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    invoiceNumber: 'INV-01',
  },
};

export default meta;
type Story = StoryObj<typeof CreateInvoice>;

export const Default: Story = {};

export const StepTwo: Story = {
  args: {
    step: 2,
  },
};

export const StepThree: Story = {
  args: {
    step: 3,
  },
};
