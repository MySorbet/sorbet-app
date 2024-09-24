import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useRef } from 'react';

import { WidgetContentType, WidgetType, WidgetTypes } from '@/types';

import { Widget } from './widget';

const meta = {
  title: 'Widget',
  component: Widget,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    type: {
      options: WidgetTypes,
      control: {
        type: 'select',
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
    return (
      <div className='size-80'>
        <Widget {...args} draggedRef={ref} />
      </div>
    );
  },
} satisfies Meta<typeof Widget>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockContent: Partial<Record<WidgetType, WidgetContentType>> = {
  Link: {
    title: 'Link Widget',
    description: 'description',
    iconUrl:
      'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌞</text></svg>',
    heroImageUrl:
      'https://storage.googleapis.com/sorbet-brand-public/sorbet-logo-400-square.jpg',
  },
  Photo: {
    image:
      'https://storage.googleapis.com/sorbet-brand-public/sorbet-logo-400-square.jpg',
  },
};

export const Default: Story = {
  // @ts-expect-error draggedRef is handled in the meta render
  args: {
    type: 'Link',
    w: 1,
    h: 1,
    content: mockContent.Link,
    loading: false,
    initialSize: 'A',
    showControls: true,
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    loading: true,
  },
};

export const Photo: Story = {
  args: {
    ...Default.args,
    type: 'Photo',
    content: mockContent.Photo,
  },
};
