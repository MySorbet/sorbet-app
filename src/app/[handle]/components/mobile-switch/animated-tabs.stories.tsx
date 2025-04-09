import { useArgs } from '@storybook/preview-api';
import { Meta, StoryObj } from '@storybook/react';
import { Moon, Sun } from 'lucide-react';

import { AnimatedTabs } from './animated-tabs';

const meta = {
  title: 'Build UI/Animated Tabs',
  component: AnimatedTabs,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof AnimatedTabs>;

export default meta;

type Story = StoryObj<typeof AnimatedTabs>;

export const Default: Story = {
  args: {
    tabs: [
      {
        id: 'sun',
        icon: <Sun />,
        tooltip: 'Light mode',
      },
      {
        id: 'moon',
        icon: <Moon />,
        tooltip: 'Dark mode',
      },
    ],
  },
  render: (args) => {
    const [{ selectedTab }, setArgs] = useArgs();
    return (
      <AnimatedTabs
        {...args}
        selectedTab={selectedTab}
        onSelectTab={(tab) => setArgs({ selectedTab: tab })}
      />
    );
  },
};
