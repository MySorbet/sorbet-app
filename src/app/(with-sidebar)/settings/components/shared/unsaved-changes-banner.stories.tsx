import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { UnsavedChangesBanner } from './unsaved-changes-banner';

const meta = {
  title: 'Settings/Shared/UnsavedChangesBanner',
  component: UnsavedChangesBanner,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof UnsavedChangesBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onCancel: fn(),
    onSave: fn(),
    isSaving: false,
  },
};

export const Saving: Story = {
  args: {
    onCancel: fn(),
    onSave: fn(),
    isSaving: true,
  },
};


