import { Meta } from '@storybook/react';

import { CopyIconButton } from './copy-icon-button';

const meta = {
  title: 'Components/common/CopyIconButton',
  component: CopyIconButton,
} satisfies Meta<typeof CopyIconButton>;

export default meta;

export const Default = {};

export const Disabled = {
  args: {
    disabled: true,
  },
};
