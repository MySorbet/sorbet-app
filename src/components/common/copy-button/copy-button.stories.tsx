import { Meta, StoryObj } from '@storybook/react';

import { CopyButton } from './copy-button';

const meta = {
  title: 'Components/common/CopyButton',
  component: CopyButton,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof CopyButton>;

export default meta;
type Story = StoryObj<typeof CopyButton>;

export const Default: Story = {
  args: {
    children: 'Copy "Hello, world!"',
    stringToCopy: 'Hello, world!',
  },
};

export const NoChildren: Story = {
  args: {
    stringToCopy: 'Hello, world!',
  },
};

export const Reversed: Story = {
  render: (args) => {
    return <CopyButton {...args} variant='link' className='flex-row-reverse' />;
  },
  args: {
    ...Default.args,
  },
};
