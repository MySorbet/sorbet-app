import { useArgs } from '@storybook/preview-api';
import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { WidgetControls } from './widget-controls';

const meta: Meta<typeof WidgetControls> = {
  title: 'Profile/v2/WidgetControls',
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
