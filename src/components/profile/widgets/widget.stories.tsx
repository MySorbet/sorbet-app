import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useRef } from 'react';

import { WidgetTypes } from '@/types';

import { Widget } from './widget';

const meta = {
  title: 'Widgets/Widget',
  component: Widget,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    type: {
      control: {
        type: 'select',
        options: WidgetTypes,
      },
    },
  },
  args: {
    handleResize: fn(),
    handleRemove: fn(),
    identifier: 'identifier',
    redirectUrl: 'https://mysorbet.xyz',
  },
  render: (args) => {
    const ref = useRef(false);
    return <Widget {...args} draggedRef={ref} />;
  },
} satisfies Meta<typeof Widget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // type: 'Link',
    w: 1,
    h: 1,
    content: {},
    loading: false,
    initialSize: 'A',
    showControls: true,
  },
};
