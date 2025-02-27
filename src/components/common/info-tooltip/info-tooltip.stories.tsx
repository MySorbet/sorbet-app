import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { InfoTooltip } from './info-tooltip';

type Story = StoryObj<typeof InfoTooltip>;

const meta = {
  title: 'Components/common/InfoTooltip',
  component: InfoTooltip,
  parameters: {
    layout: 'centered',
  },
  args: {
    children: 'This is a helpful tooltip',
    onClick: fn(),
  },
} satisfies Meta<typeof InfoTooltip>;

export default meta;

export const Default: Story = {};

export const WithCustomClassName: Story = {
  args: {
    className: 'text-blue-500 size-6',
  },
};

export const WithLongContent: Story = {
  args: {
    children:
      'This is a longer tooltip with more detailed information that might wrap to multiple lines.',
  },
};

export const WithCustomContent: Story = {
  args: {
    children: (
      <div>
        <p className='font-bold'>Rich Content</p>
        <p>You can include HTML in tooltips</p>
        <ul className='mt-2 list-disc pl-4'>
          <li>Item 1</li>
          <li>Item 2</li>
        </ul>
      </div>
    ),
  },
};
