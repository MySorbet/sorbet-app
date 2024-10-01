import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { WidgetTypesWithIcons } from '@/components/profile/widgets/widget-icon';

import { WidgetPlaceholder } from './widget-placeholder';

const meta = {
  title: 'Widgets/WidgetPlaceholder',
  component: WidgetPlaceholder,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    type: 'Behance',
    onClick: fn(),
  },
  argTypes: {
    type: {
      options: WidgetTypesWithIcons,
      control: {
        type: 'select',
      },
    },
  },
} satisfies Meta<typeof WidgetPlaceholder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    loading: true,
  },
};

// New stories for remaining widget types
export const Substack: Story = {
  args: { type: 'Substack' },
};

export const SpotifySong: Story = {
  args: { type: 'SpotifySong' },
};

export const SpotifyAlbum: Story = {
  args: { type: 'SpotifyAlbum' },
};

export const SoundcloudSong: Story = {
  args: { type: 'SoundcloudSong' },
};

export const InstagramPost: Story = {
  args: { type: 'InstagramPost' },
};

export const InstagramProfile: Story = {
  args: { type: 'InstagramProfile' },
};

export const TwitterProfile: Story = {
  args: { type: 'TwitterProfile' },
};

export const LinkedInProfile: Story = {
  args: { type: 'LinkedInProfile' },
};

export const Youtube: Story = {
  args: { type: 'Youtube' },
};

export const Github: Story = {
  args: { type: 'Github' },
};

export const Dribbble: Story = {
  args: { type: 'Dribbble' },
};

export const Medium: Story = {
  args: { type: 'Medium' },
};

export const Figma: Story = {
  args: { type: 'Figma' },
};
