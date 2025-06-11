import { useArgs } from '@storybook/preview-api';
import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { MobileSwitch } from './mobile-switch';

const meta = {
  title: 'Mobile Switch',
  component: MobileSwitch,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof MobileSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isMobile: false,
    onIsMobileChange: fn(),
  },
};

export const Mobile: Story = {
  args: {
    isMobile: true,
    onIsMobileChange: fn(),
  },
};

export const Interactive: Story = {
  args: Default.args,
  render: (args) => {
    const [{ isMobile }, setArgs] = useArgs();
    return (
      <MobileSwitch
        {...args}
        isMobile={isMobile}
        onIsMobileChange={(isMobile) => setArgs({ isMobile })}
      />
    );
  },
};
