import { Meta, StoryObj } from '@storybook/react';
import { fn, userEvent, within } from '@storybook/test';

import {
  BankRecipientFormContext,
  BankRecipientSubmitButton,
} from './bank-recipient-form';
import { NakedBankRecipientForm } from './bank-recipient-form';
import { debugToast, FillOutBankRecipientForm } from './story-utils';

const meta = {
  title: 'Recipients/BankRecipientForm',
  component: NakedBankRecipientForm,
  parameters: {
    layout: 'centered',
  },
  args: {
    onSubmit: fn(debugToast),
    eurLocked: false,
  },
  decorators: [
    (Story) => (
      <BankRecipientFormContext>
        <div className='w-[340px]'>
          <Story />
          <BankRecipientSubmitButton />
        </div>
      </BankRecipientFormContext>
    ),
  ],
} satisfies Meta<typeof NakedBankRecipientForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const EURLocked: Story = {
  args: {
    eurLocked: true,
  },
};

export const FillForm: Story = {
  play: async ({ canvasElement }) => {
    await FillOutBankRecipientForm({ canvasElement });
  },
};

/** Fills the form and adds an optional nickname */
export const WithNickname: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await FillOutBankRecipientForm({ canvasElement });
    await userEvent.type(canvas.getByLabelText(/Nickname/i), 'Payroll EUR');
  },
};

/** Switches to Business account type tab */
export const BusinessAccount: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('tab', { name: /Business/i }));
  },
};
