import { useArgs } from '@storybook/preview-api';
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '@/components/ui/button';

import { Sidebar } from './sidebar';

const meta = {
  title: 'Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'centered',
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

export const Default: Story = {
  render: (args) => {
    const [{ isOpen }, updateArgs] = useArgs();
    const handleSetOpen = (isOpen: boolean) => {
      updateArgs({ isOpen });
    };
    return (
      <>
        <Sidebar {...args} isOpen={isOpen} onIsOpenChange={handleSetOpen} />
        <Button variant='sorbet' onClick={() => handleSetOpen(!isOpen)}>
          Open sidebar
        </Button>
      </>
    );
  },
};
