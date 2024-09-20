import { Meta } from '@storybook/react';
import { Step2 } from './step2';
import {
  initialUserSignUp,
  UserSignUp,
  UserSignUpContext,
  useUserSignUp,
} from '@/components/onboarding/signup/signup';
import { useEffect, useState } from 'react';
import { within, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta = {
  component: Step2,
  parameters: {
    layout: 'centered',
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
} satisfies Meta<typeof Step2>;

export default meta;
export const Default = {};

export const SimulateMaxCharacters = {
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);

    // Wait for the component to render
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Try to find the textarea
    let bioTextarea: HTMLTextAreaElement;
    try {
      bioTextarea = await canvas.findByRole('textbox');
      console.log('Found textarea by role');
    } catch (error) {
      try {
        bioTextarea = await canvas.findByPlaceholderText(/bio|about you/i);
        console.log('Found textarea by placeholder');
      } catch (error) {
        console.error('Could not find textarea');
        throw error;
      }
    }

    // Type some text
    await userEvent.type(bioTextarea, 'Test input');

    // Try to type more than 100 characters
    const longInput = 'a'.repeat(101);
    await userEvent.clear(bioTextarea);
    await userEvent.type(bioTextarea, longInput);
  },
};
