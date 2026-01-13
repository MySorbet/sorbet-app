import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { IndividualOrBusiness } from './individual-or-business';

const meta = {
  title: 'IndividualOrBusiness',
  component: IndividualOrBusiness,
  parameters: {
    layout: 'centered',
  },
  args: {
    onSubmit: fn(),
  },
} satisfies Meta<typeof IndividualOrBusiness>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
