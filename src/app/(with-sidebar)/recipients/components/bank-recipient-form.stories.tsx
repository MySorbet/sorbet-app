import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

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
    eurAllowed: true,
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
export const NoEUR: Story = {
  args: {
    eurAllowed: false,
  },
};

export const FillForm: Story = {
  play: async ({ canvasElement }) => {
    await FillOutBankRecipientForm({ canvasElement });
  },
};
