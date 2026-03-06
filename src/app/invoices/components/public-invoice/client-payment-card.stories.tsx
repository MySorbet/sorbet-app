import type { Meta, StoryObj } from '@storybook/react';

import type { DueBankDetailsForRail } from '@/app/invoices/hooks/use-due-bank-details';

import { ClientPaymentCard } from './client-payment-card';

const meta = {
  title: 'Invoices/ClientPaymentCard',
  component: ClientPaymentCard,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className='w-96'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ClientPaymentCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const achBankDetails: DueBankDetailsForRail = {
  rail: 'usd_ach',
  data: {
    accountType: 'individual',
    accountName: 'Sorbet Inc.',
    accountNumber: '123456789',
    routingNumber: '021000021',
    routingNumberACH: '021000021',
    bankName: 'Chase Bank',
    bankAddress: '270 Park Ave, New York, NY 10017',
  },
};

const sepaBankDetails: DueBankDetailsForRail = {
  rail: 'eur_sepa',
  data: {
    accountType: 'individual',
    firstName: 'Sorbet',
    lastName: 'Inc.',
    IBAN: 'DE89370400440532013000',
    bankName: 'Deutsche Bank',
    swiftCode: 'DEUTDEDB',
  },
};

export const Default: Story = {
  args: {
    address: '0x1234567890123456789012345678901234567890',
    bankDetails: achBankDetails,
    dueDate: new Date('2024-04-15'),
  },
};

export const WithSepa: Story = {
  args: {
    ...Default.args,
    bankDetails: sepaBankDetails,
  },
};

export const NoDate: Story = {
  args: {
    ...Default.args,
    dueDate: undefined,
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    isLoading: true,
  },
};

export const USDOnly: Story = {
  args: {
    ...Default.args,
    address: undefined,
  },
};

export const USDCOnly: Story = {
  args: {
    ...Default.args,
    bankDetails: undefined,
  },
};
