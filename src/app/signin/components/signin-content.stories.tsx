import { Meta, StoryObj } from '@storybook/react';

import { SigninContent } from './signin-content';

const meta: Meta<typeof SigninContent> = {
  component: SigninContent,
  title: 'Signin/SigninContent',
  parameters: {
    layout: 'centered',
    backgrounds: { disable: true },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
