import { Meta, StoryObj } from '@storybook/react';

import { mockUserMinimal } from '@/api/user/mock-user';
import { Button } from '@/components/ui/button';
import { sleep } from '@/lib/utils';

import { WidgetGrid } from './grid';
import { useWidgets, WidgetProvider } from './use-widget-context';

const meta = {
  title: 'Profile/WidgetGrid',
  component: WidgetGrid,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <WidgetProvider userId={mockUserMinimal.id}>
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
