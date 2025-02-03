import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { SidebarProvider } from '@/components/ui/sidebar';

import { AppSidebar } from './app-sidebar';

type Story = StoryObj<typeof AppSidebar>;

const meta = {
  title: 'Sidebar/AppSidebar',
  component: AppSidebar,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <SidebarProvider>
        <Story />
      </SidebarProvider>
    ),
  ],
} satisfies Meta<typeof AppSidebar>;

export default meta;

export const Default: Story = {
  args: {},
};
