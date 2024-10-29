import { useArgs } from '@storybook/preview-api';
import type { Meta, StoryObj } from '@storybook/react';

import { Sidebar } from './sidebar';

const meta = {
  title: 'Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'centered',
    nextjs: {
      appDirectory: true,
    },
  },
  render: (args) => {
    const [{ isOpen }, updateArgs] = useArgs();
    const handleSetOpen = (isOpen: boolean) => {
      updateArgs({ isOpen });
    };
    return <Sidebar {...args} isOpen={isOpen} onIsOpenChange={handleSetOpen} />;
  },
  args: {
    isOpen: true,
  },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {};
