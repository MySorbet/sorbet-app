import { Meta } from '@storybook/react';

import { AllSet } from '@/components/onboarding/signup/all-set';

import { UserSignUpDecorator } from './user-signup.decorator';

const meta = {
  title: 'Onboarding/AllSet',
  component: AllSet,
  parameters: {
    layout: 'centered',
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [UserSignUpDecorator],
} satisfies Meta<typeof AllSet>;

export default meta;
export const Default = {};
