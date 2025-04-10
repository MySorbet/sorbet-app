import { Meta, StoryObj } from '@storybook/react';

import { ArtificialMobile } from './artificial-mobile';

const meta = {
  title: 'Profile/ArtificialMobile',
  component: ArtificialMobile,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    children: {
      table: {
        disable: true,
      },
    },
  },
  decorators: [
    (Story) => (
      <div className='h-screen w-screen'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ArtificialMobile>;

export default meta;

type Story = StoryObj<typeof ArtificialMobile>;

export const Default: Story = {
  args: {
    children: (
      <div className='bg-sorbet/20 flex size-full flex-col items-center justify-center'>
        Hello world
      </div>
    ),
  },
};

export const Mobile: Story = {
  args: {
    ...Default.args,
    isMobile: true,
  },
};

export const ShowMotion: Story = {
  args: {
    ...Default.args,
    isMobile: true,
    duration: 2,
  },
};

export const WithScroll: Story = {
  args: {
    ...Default.args,
    children: (
      <div className='bg-sorbet/20 flex size-full h-[1000px] flex-col items-center justify-center'>
        Hello world
      </div>
    ),
  },
};
