import { Meta, StoryObj } from '@storybook/react';

import { AddressForm } from './address-form';

const meta = {
  title: 'Transfers/AddressForm',
  component: AddressForm,
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
} satisfies Meta<typeof AddressForm>;

export default meta;

type Story = StoryObj<typeof AddressForm>;

export const Default: Story = {};
