import type { Meta, StoryObj } from '@storybook/react';

import { SidebarProvider } from '@/components/ui/sidebar';

import SettingsPage from './page';

const meta = {
  title: 'Settings',
  component: SettingsPage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <SidebarProvider>
        <Story />
      </SidebarProvider>
    ),
  ],
} satisfies Meta<typeof SettingsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

// Empty form
export const Default: Story = {};

// Pre-filled form with normal values
export const FilledForm: Story = {
  args: {
    defaultValues: {
      firstName: 'John',
      lastName: 'Doe',
    },
  },
};

// Form with long values
export const LongValues: Story = {
  args: {
    defaultValues: {
      firstName:
        'Smith-Jones-Williams-Brown-Smith-Jones-Williams-Brown-Smith-Jones-Williams',
      lastName:
        'Smith-Jones-Williams-Brown-Smith-Jones-Williams-Brown-Smith-Jones-Williams',
    },
  },
};
