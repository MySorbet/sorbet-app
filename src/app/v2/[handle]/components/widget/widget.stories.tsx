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

/** Helper to create a container with specific dimensions */
const createSizeContainer = (width: number, height: number) => {
  return (Story: StoryFn) => (
    <div className={`h-[${height}px] w-[${width}px]`}>
      <Story />
    </div>
  );
};

const sizeConfigs = {
  A: { width: 390, height: 390 },
  B: { width: 175, height: 175 },
  C: { width: 175, height: 390 },
  D: { width: 390, height: 175 },
} as const;

export const Default: Story = {
  decorators: [createSizeContainer(sizeConfigs.A.width, sizeConfigs.A.height)],
  args: {
    title: 'Widget',
    href: 'https://www.google.com',
    size: 'A',
  },
};

export const A: Story = {
  decorators: [createSizeContainer(sizeConfigs.A.width, sizeConfigs.A.height)],
  args: {
    ...Default.args,
    size: 'A',
  },
};

export const B: Story = {
  decorators: [createSizeContainer(sizeConfigs.B.width, sizeConfigs.B.height)],
  args: {
    ...Default.args,
    size: 'B',
  },
};

export const C: Story = {
  decorators: [createSizeContainer(sizeConfigs.C.width, sizeConfigs.C.height)],
  args: {
    ...Default.args,
    size: 'C',
  },
};

export const D: Story = {
  decorators: [createSizeContainer(sizeConfigs.D.width, sizeConfigs.D.height)],
  args: {
    ...Default.args,
    size: 'D',
  },
};

export const WithIcon: Story = {
  decorators: [createSizeContainer(sizeConfigs.A.width, sizeConfigs.A.height)],
  args: {
    ...Default.args,
    iconUrl:
      'https://storage.googleapis.com/bkt-ph-prod-homepage-static-public/img/favicon.d8b7874261c3.ico',
    contentUrl:
      'https://creatorspace.imgix.net/sites/ogimages/aHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL2xleWVfYnVja2V0L3dwLWNvbnRlbnQvdXBsb2Fkcy80NWZhOGY0MS10b21hdG8tbW96ejItMjAyMDA4MTlfbGV5ZV9iLXNxdWFyZS1waXp6YS0yNTUtNzUuanBn.jpeg?width=600&height=600',
  },
};

export const Loading: Story = {
  decorators: [createSizeContainer(sizeConfigs.A.width, sizeConfigs.A.height)],
  args: {
    ...Default.args,
    loading: true,
  },
};
