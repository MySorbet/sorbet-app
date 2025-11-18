import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, waitFor } from '@storybook/test';
import { userEvent, within } from '@storybook/test';
import { addDays } from 'date-fns';
import { useEffect, useState } from 'react';

import { mockCheckInvoiceNumberHandler } from '@/api/invoices/msw-handlers';

import { useInvoiceNumber } from '../hooks/use-invoice-number';
import { AcceptedPaymentMethod, InvoiceForm } from '../schema';
import { CreateInvoice } from './create-invoice';

const meta = {
  title: 'Invoices/CreateInvoice',
  component: CreateInvoice,
  parameters: {
    layout: 'fullscreen',
    msw: {
      handlers: [mockCheckInvoiceNumberHandler],
    },
  },
  args: {
    onCreate: fn(),
    onClose: fn(),
  },
} satisfies Meta<typeof CreateInvoice>;

export default meta;
type Story = StoryObj<typeof meta>;

const samplePrefills: Required<Omit<InvoiceForm, 'taxId' | 'address'>> &
  Pick<InvoiceForm, 'taxId' | 'address'> = {
  toName: 'John Doe',
  toEmail: 'john.doe@example.com',
  fromName: 'Jane Smith',
  fromEmail: 'jane.smith@example.com',
  issueDate: new Date(),
  dueDate: addDays(new Date(), 7),
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
  taxId: undefined,
  address: undefined,
};

export const Default: Story = {
  args: {
    walletAddress: '0x0000000000000000000000000000000000000000',
  },
};

export const IsCreating: Story = {
  args: {
    ...Default.args,
    isCreating: true,
  },
};

export const Unverified: Story = {
  args: {
    ...Default.args,
    onGetVerified: fn(),
  },
};

export const WithPrefills: Story = {
  args: {
    ...Default.args,
    prefills: samplePrefills,
  },
};

export const WithDelayedInvoiceNumber: Story = {
  args: {
    ...Default.args,
  },
  render: (args) => {
    const invoiceNumber = useInvoiceNumber();
    return <CreateInvoice {...args} prefills={{ invoiceNumber }} />;
  },
};

export const WithDelayedPaymentMethods: Story = {
  args: {
    ...Default.args,
  },
  render: (args) => {
    const [paymentMethods, setPaymentMethods] =
      useState<AcceptedPaymentMethod[]>();
    useEffect(() => {
      setTimeout(() => {
        setPaymentMethods(['usdc', 'usd']);
      }, 1000);
    }, []);
    return (
      <CreateInvoice {...args} prefills={{ paymentMethods: paymentMethods }} />
    );
  },
};

export const WithInteraction: Story = {
  args: {
    ...Default.args,
  },
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
