import { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/test';

import { BankForm } from './bank-form';

const meta = {
  title: 'Transfers/BankForm',
  component: BankForm,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className='w-[340px]'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BankForm>;

export default meta;

type Story = StoryObj<typeof BankForm>;

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
    // await userEvent.click(canvas.getByRole('button', { name: /Save/i }));
  },
};
