import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { PreviewControls } from './preview-controls';

const meta = {
  title: 'Profile/PreviewControls',
  component: PreviewControls,
  parameters: {
    layout: 'centered',
  },
  args: {
    onUpload: fn(),
    onRevert: fn(),
    onDelete: fn(),
  },
} satisfies Meta<typeof PreviewControls>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
