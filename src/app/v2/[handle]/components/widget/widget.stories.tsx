import { Meta, StoryFn, StoryObj } from '@storybook/react';

import { Widget } from './widget';

const meta = {
  title: 'Profile/v2/Widget',
  component: Widget,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story: StoryFn) => (
      <div className='h-fit'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Widget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Widget',
    href: 'https://www.google.com',
    size: 'A',
  },
};

export const WithIcon: Story = {
  args: {
    ...Default.args,
    iconUrl:
      'https://storage.googleapis.com/bkt-ph-prod-homepage-static-public/img/favicon.d8b7874261c3.ico',
    contentUrl:
      'https://creatorspace.imgix.net/sites/ogimages/aHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL2xleWVfYnVja2V0L3dwLWNvbnRlbnQvdXBsb2Fkcy80NWZhOGY0MS10b21hdG8tbW96ejItMjAyMDA4MTlfbGV5ZV9iLXNxdWFyZS1waXp6YS0yNTUtNzUuanBn.jpeg?width=600&height=600',
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    loading: true,
  },
};
