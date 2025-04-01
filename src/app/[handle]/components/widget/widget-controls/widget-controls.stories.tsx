import { useArgs } from '@storybook/preview-api';
import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { ImageWidgetControls, WidgetControls } from './widget-controls';

const meta: Meta<typeof WidgetControls> = {
  title: 'Profile/WidgetControls',
  component: WidgetControls,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className='h-fit'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof WidgetControls>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 'A',
    onSizeChange: fn(),
  },
};

export const WithState: Story = {
  args: {
    size: 'A',
  },
  render: (args) => {
    const [, setSize] = useArgs();

    return (
      <WidgetControls
        {...args}
        onSizeChange={(newSize) => setSize({ size: newSize })}
      />
    );
  },
};

export const WithLink: Story = {
  args: {
    size: 'A',
    onAddLink: fn(),
    controls: ImageWidgetControls,
  },
};
export const WithLinkPrefilled: Story = {
  args: {
    ...WithLink.args,
    href: 'https://www.google.com',
  },
};
