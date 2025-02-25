import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, waitFor } from '@storybook/test';
import { userEvent, within } from '@storybook/test';
import { addDays } from 'date-fns';

import { mockCheckInvoiceNumberHandler } from '@/api/invoices/msw-handlers';

import { InvoiceForm } from '../schema';
import { CreateInvoice } from './create-invoice';

const meta = {
  title: 'Invoices/CreateInvoice',
  component: CreateInvoice,
  parameters: {
    layout: 'fullscreen',
    msw: {
      handlers: [mockCheckInvoiceNumberHandler],
    },
    args: {
      onCreate: fn(),
      onClose: fn(),
    },
  },
} satisfies Meta<typeof CreateInvoice>;

export default meta;
type Story = StoryObj<typeof CreateInvoice>;

const samplePrefills: Required<InvoiceForm> = {
  toName: 'John Doe',
  toEmail: 'john.doe@example.com',
  fromName: 'Jane Smith',
  fromEmail: 'jane.smith@example.com',
  issueDate: new Date('2024-03-20'),
  dueDate: addDays(new Date('2024-03-20'), 7),
  memo: 'Sample invoice for development',
  items: [
    {
      name: 'Consulting Services',
      quantity: 10,
      amount: 150,
    },
  ],
  invoiceNumber: 'INV-010',
  tax: 10,
  paymentMethods: ['usdc'],
};

export const Default: Story = {};

export const Unverified: Story = {
  args: {
    onGetVerified: fn(),
  },
};

export const WithPrefills: Story = {
  args: {
    prefills: samplePrefills,
  },
};

export const WithInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Fill out recipient details
    await userEvent.type(canvas.getByLabelText('Name'), samplePrefills.toName);
    await userEvent.type(
      canvas.getByLabelText('Email'),
      samplePrefills.toEmail
    );

    // Fill out item details
    await userEvent.type(
      canvas.getByLabelText('Item name'),
      samplePrefills.items[0].name
    );
    await userEvent.type(
      canvas.getByLabelText('Qty'),
      samplePrefills.items[0].quantity.toString()
    );
    await userEvent.type(
      canvas.getByLabelText(/Price/i),
      samplePrefills.items[0].amount.toString()
    );

    // TODO: Add a second item

    // Fill out invoice details
    await userEvent.type(
      canvas.getByLabelText('Invoice number'),
      samplePrefills.invoiceNumber
    );
    await userEvent.type(canvas.getByLabelText(/Memo/i), samplePrefills.memo);

    // TODO: Fix the tax field label and uncomment this
    // await userEvent.type(
    //   canvas.getByLabelText(/tax/i),
    //   samplePrefills.tax.toString()
    // );

    // Click the your info tab
    await userEvent.click(canvas.getByRole('tab', { name: /your info/i }));

    // Fill out your info
    await userEvent.type(
      canvas.getByLabelText('Name'),
      samplePrefills.fromName
    );
    await userEvent.type(
      canvas.getByLabelText('Email'),
      samplePrefills.fromEmail
    );

    // Click the payment method tab
    await userEvent.click(canvas.getByRole('tab', { name: /payment/i }));

    // Select payment method
    await userEvent.click(canvas.getByLabelText('Accept USD payments'));

    // wait for the button to be enabled
    await waitFor(() => {
      expect(
        canvas.getByRole('button', { name: /create invoice/i })
      ).toBeEnabled();
    });

    // Create the invoice
    await userEvent.click(
      canvas.getByRole('button', { name: /create invoice/i })
    );
  },
};
