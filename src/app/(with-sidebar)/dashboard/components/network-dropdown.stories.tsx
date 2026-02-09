import { useArgs } from '@storybook/preview-api';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { type NetworkValue, NetworkDropdown } from './network-dropdown';

const meta = {
  title: 'Dashboard/NetworkDropdown',
  component: NetworkDropdown,
  parameters: {
    layout: 'centered',
  },
  args: {
    value: 'base' as NetworkValue,
    disabled: false,
    onChange: fn(),
  },
} satisfies Meta<typeof NetworkDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: (args) => {
    const [{ value }, updateArgs] = useArgs();
    return (
      <NetworkDropdown
        {...args}
        value={value}
        onChange={(v) => updateArgs({ value: v })}
      />
    );
  },
};

export const Disabled: Story = {
  args: { disabled: true, onChange: fn() },
};
