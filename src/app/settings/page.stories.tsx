import type { Meta, StoryObj } from '@storybook/react';
import SettingsPage from './page';

const meta: Meta<typeof SettingsPage> = {
  title: 'Settings',
  component: SettingsPage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SettingsPage>;

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
      firstName: 'Smith-Jones-Williams-Brown-Smith-Jones-Williams-Brown-Smith-Jones-Williams',
      lastName: 'Smith-Jones-Williams-Brown-Smith-Jones-Williams-Brown-Smith-Jones-Williams',
    },
  },
};