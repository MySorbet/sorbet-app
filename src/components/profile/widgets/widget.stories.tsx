import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useRef } from 'react';

import { WidgetSize } from '@/types';

import { Widget } from './widget';

const meta = {
  title: 'Widget',
  component: Widget,
  parameters: {
    layout: 'centered',
  },
  args: {
    handleResize: fn(),
    handleRemove: fn(),
  },
} satisfies Meta<typeof Widget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  render: () => {
    const ref = useRef(false);
    return (
      <Widget
        identifier='identifier'
        type='Link'
        w={1}
        h={1}
        content={{}}
        loading={true}
        initialSize='A'
        redirectUrl='https://mysorbet.xyz'
        draggedRef={ref}
        showControls={true}
        handleResize={function (
          key: string,
          w: number,
          h: number,
          size: WidgetSize
        ): void {
          throw new Error('Function not implemented.');
        }}
        handleRemove={function (key: string): void {
          throw new Error('Function not implemented.');
        }}
      />
    );
  },
};
