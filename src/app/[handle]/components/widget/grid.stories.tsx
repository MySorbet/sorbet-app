import { Meta, StoryObj } from '@storybook/react';

import { mockUserMinimal } from '@/api/user/mock-user';
import { mockUserByHandleHandler } from '@/api/user/msw-handlers';
import {
  mockCreateWidgetHandler,
  mockEnrichWidgetHandler,
  mockGetWidgetsHandler,
  mockUpdateWidgetHandler,
} from '@/api/widgets-v2/msw-handlers';
import { Button } from '@/components/ui/button';

import { WidgetGrid } from './grid';
import { useWidgets, WidgetProvider } from './use-widget-context';

const meta = {
  title: 'Profile/WidgetGrid',
  component: WidgetGrid,
  parameters: {
    layout: 'fullscreen',
    msw: {
      handlers: [
        mockUserByHandleHandler,
        mockGetWidgetsHandler,
        mockUpdateWidgetHandler,
        mockCreateWidgetHandler,
        mockEnrichWidgetHandler,
      ],
    },
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
      <div className='size-full p-4'>
        <Button onClick={() => addWidget('https://mysorbet.io')}>
          Add widget
        </Button>
        <WidgetGrid />
      </div>
    );
  },
};
