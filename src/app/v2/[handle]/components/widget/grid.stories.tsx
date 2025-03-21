import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { sleep } from '@/lib/utils';

import { WidgetGrid } from './grid';
import { ramiMockWidgets } from './rami-mock-widgets';
import { WidgetProvider } from './use-widget-context';

const meta = {
  title: 'Profile/v2/WidgetGrid',
  component: WidgetGrid,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <WidgetProvider>
        <Story />
      </WidgetProvider>
    ),
  ],
} satisfies Meta<typeof WidgetGrid>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    widgets: [
      {
        id: '1',
        title: 'Widget 1',
        contentUrl: 'https://picsum.photos/200/300',
        href: 'https://picsum.photos/200/300',
        iconUrl: 'https://picsum.photos/200/300',
        size: 'A',
      },
      {
        id: '2',
        title: 'Widget 2',
        contentUrl: 'https://picsum.photos/200/300',
        href: 'https://picsum.photos/200/300',
        iconUrl: 'https://picsum.photos/200/300',
        size: 'B',
      },
      {
        id: '3',
        title: 'Widget 3',
        contentUrl: 'https://picsum.photos/200/300',
        href: 'https://picsum.photos/200/300',
        iconUrl: 'https://picsum.photos/200/300',
        size: 'C',
      },
      {
        id: '4',
        title: 'Widget 4',
        contentUrl: 'https://picsum.photos/200/300',
        href: 'https://picsum.photos/200/300',
        iconUrl: 'https://picsum.photos/200/300',
        size: 'D',
      },
    ],
  },
};

export const RamiMockWidgets: Story = {
  args: {
    widgets: ramiMockWidgets,
  },
};

const mockFetchWidgetData = async (url: string) => {
  await sleep(3000);
  return { contentUrl: url, iconUrl: url };
};

export const Rendered = {
  render: () => {
    const [widgets, setWidgets] = useState(ramiMockWidgets);

    return (
      <div className='size-full'>
        <Button
          onClick={async () => {
            const newWidgets = [
              {
                id: '5',
                title: 'picsum.photos',
                href: 'https://picsum.photos/200/300',
                size: 'C' as const,
                loading: true,
              },
              ...ramiMockWidgets,
            ];
            setWidgets(newWidgets);
            const data = await mockFetchWidgetData(
              'https://picsum.photos/200/300'
            );
            // Find widget with id 5 and update it imperatively
            const widget = newWidgets.find((w) => w.id === '5');
            if (widget) {
              console.log('widget', widget);
              setWidgets([
                { ...widget, loading: false, ...data, title: 'Something nice' },
                ...newWidgets.filter((w) => w.id !== '5'),
              ]);
            }
          }}
        >
          Add widget
        </Button>
        <WidgetGrid widgets={widgets} />
      </div>
    );
  },
};
