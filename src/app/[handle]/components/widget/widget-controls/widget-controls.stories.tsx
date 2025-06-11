import { useArgs } from '@storybook/preview-api';
import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { ImageControls } from './control-config';
import { WidgetControls } from './widget-controls';

const meta = {
  title: 'Profile/WidgetControls',
  component: WidgetControls,
  parameters: {
    layout: 'centered',
  },
  args: {
    size: 'A',
    onSizeChange: fn(),
    onAddLink: fn(),
  },
} satisfies Meta<typeof WidgetControls>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLinkAndInteractive: Story = {
  name: 'With Link and Interactive',
  args: {
    size: 'A',
    controls: ImageControls,
    isPopoverOpen: false,
    href: 'https://www.google.com',
  },
  render: (args) => {
    const [, setArgs] = useArgs();

    return (
      <WidgetControls
        {...args}
        onSizeChange={(newSize) => setArgs({ size: newSize })}
        setIsPopoverOpen={(isPopoverOpen) => setArgs({ isPopoverOpen })}
        onAddLink={(link) => setArgs({ href: link })}
      />
    );
  },
};
