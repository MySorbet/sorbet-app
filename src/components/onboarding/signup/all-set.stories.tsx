import { Meta } from '@storybook/react';
import { useState } from 'react';

import { AllSet } from '@/components/onboarding/signup/all-set';
import {
  initialUserSignUp,
  UserSignUp,
  UserSignUpContext,
} from '@/components/onboarding/signup/signup';

const meta = {
  title: 'Onboarding/AllSet',
  component: AllSet,
  parameters: {
    layout: 'centered',
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => {
      const [userData, setUserData] = useState<UserSignUp>(initialUserSignUp);
      const [step, setStep] = useState<number>(0);
      return (
        <UserSignUpContext.Provider
          value={{ userData, setUserData, step, setStep }}
        >
          <Story />
        </UserSignUpContext.Provider>
      );
    },
  ],
} satisfies Meta<typeof AllSet>;

export default meta;
export const Default = {};
