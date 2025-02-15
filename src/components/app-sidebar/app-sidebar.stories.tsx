import type { Meta, StoryObj } from '@storybook/react';
import { Menu } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { SidebarProvider, useSidebar } from '@/components/ui/sidebar';

import { AppSidebar } from './app-sidebar';

type Story = StoryObj<typeof AppSidebar>;

const meta = {
  title: 'Sidebar/AppSidebar',
  component: AppSidebar,
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'desktop',
    },
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

export const Default: Story = {};

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: () => {
    const { toggleSidebar } = useSidebar();
    return (
      <div className='flex h-screen w-screen justify-end p-4'>
        <AppSidebar />
        <Button onClick={toggleSidebar} variant='ghost' size='icon'>
          <Menu />
        </Button>
      </div>
    );
  },
};
