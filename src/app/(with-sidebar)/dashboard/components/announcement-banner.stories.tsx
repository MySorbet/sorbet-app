import type { Meta, StoryObj } from '@storybook/react';

import { AnnouncementBanner } from './announcement-banner';

const meta = {
  title: 'Dashboard/AnnouncementBanner',
  component: AnnouncementBanner,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof AnnouncementBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onComplete: () => console.log('Complete clicked'),
  },
};
