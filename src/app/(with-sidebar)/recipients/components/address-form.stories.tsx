import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { AddressForm } from './address-form';
import { debugToast } from './story-utils';

const meta = {
  title: 'Transfers/AddressForm',
  component: AddressForm,
  parameters: {
    layout: 'centered',
  },
  args: {
    onSubmit: fn(debugToast),
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
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
