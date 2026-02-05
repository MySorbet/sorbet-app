import type { Meta, StoryObj } from '@storybook/react';
import { useArgs } from '@storybook/preview-api';

import { NetworkDropdown, type NetworkValue } from './network-dropdown';

const meta = {
  title: 'Dashboard/NetworkDropdown',
  component: NetworkDropdown,
  parameters: {
    layout: 'centered',
  },
  args: {
    value: 'base' as NetworkValue,
    disabled: false,
    onChange: () => {},
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
  args: { disabled: true, onChange: () => {} },
};

