import { Meta, StoryObj } from '@storybook/react';
import { fn, userEvent, within } from '@storybook/test';

import {
  BankRecipientFormContext,
  BankRecipientSubmitButton,
} from './bank-recipient-form';
import { NakedBankRecipientForm } from './bank-recipient-form';
import { debugToast } from './utils';

const meta = {
  title: 'Transfers/BankRecipientForm',
  component: NakedBankRecipientForm,
  parameters: {
    layout: 'centered',
  },
  args: {
    onSubmit: fn(debugToast),
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

type Story = StoryObj<typeof NakedBankRecipientForm>;

export const Default: Story = {};

export const FillForm: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Fill bank name
    await userEvent.type(canvas.getByLabelText(/Bank name/i), 'Chase Bank');

    // Fill account owner name
    await userEvent.type(canvas.getByLabelText(/Account Owner/i), 'John Doe');

    // Skip account type

    // Fill account number
    await userEvent.type(canvas.getByLabelText(/Account Number/i), '123456789');

    // Fill routing number
    await userEvent.type(canvas.getByLabelText(/Routing Number/i), '987654321');

    // Fill address fields
    await userEvent.type(
      canvas.getByLabelText(/Address Line 1/i),
      '123 Main St'
    );

    await userEvent.type(canvas.getByLabelText(/City/i), 'San Francisco');

    await userEvent.type(canvas.getByLabelText(/Postal Code/i), '94103');

    // TODO: State

    // Skip country

    // Submit the form
    await userEvent.click(canvas.getByRole('button', { name: /Save/i }));
  },
};
