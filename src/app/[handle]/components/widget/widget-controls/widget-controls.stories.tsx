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
    controls: ImageWidgetControls,
    isPopoverOpen: true,
  },
  render: (args) => {
    const [, setArgs] = useArgs();

    return (
      <WidgetControls
        {...args}
        onSizeChange={(newSize) => setArgs({ size: newSize })}
        setIsPopoverOpen={(isPopoverOpen) => setArgs({ isPopoverOpen })}
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

export const WithLinkState: Story = {
  args: {
    size: 'A',
    controls: ImageWidgetControls,
  },
  render: (args) => {
    const [, setLink] = useArgs<{ href: string | null }>();

    return (
      <WidgetControls {...args} onAddLink={(link) => setLink({ href: link })} />
    );
  },
};
