import { Meta } from '@storybook/react';

import { CopyButton } from './copy-button';

const meta = {
  title: 'Components/common/CopyButton',
  component: CopyButton,
} satisfies Meta<typeof CopyButton>;

export default meta;

export const Default = {
  args: {
    children: 'Copy "Hello, world!"',
    stringToCopy: 'Hello, world!',
  },
};

export const NoChildren = {
  args: {
    stringToCopy: 'Hello, world!',
  },
};
