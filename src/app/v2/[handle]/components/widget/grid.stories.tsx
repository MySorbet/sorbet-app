import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { sleep } from '@/lib/utils';

import { WidgetGrid } from './grid';
import { ramiMockWidgets } from './mock-widgets';
import { useWidgets, WidgetProvider } from './use-widget-context';

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

export const Default: Story = {};

export const Immutable: Story = {
  args: {
    immutable: true,
  },
};

export const WithAddButton: Story = {
  render: () => {
    const { addWidget } = useWidgets();
    return (
      <div className='size-full'>
        <Button onClick={() => addWidget('https://mysorbet.io')}>
          Add widget
        </Button>
        <WidgetGrid />
      </div>
    );
  },
};

const mockFetchWidgetData = async (url: string) => {
  await sleep(3000);
  return { contentUrl: url, iconUrl: url };
};

export const RenderedDeprecated = {
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
              ...Object.values(ramiMockWidgets),
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
