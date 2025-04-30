import { Meta, StoryObj } from '@storybook/react';

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
