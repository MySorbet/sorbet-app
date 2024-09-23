import { Meta } from '@storybook/react';
import { Step2 } from './step2';
import {
  initialUserSignUp,
  UserSignUp,
  UserSignUpContext,
} from '@/components/onboarding/signup/signup';
import { useState } from 'react';
import { within, userEvent } from '@storybook/testing-library';
import { MAX_BIO_LENGTH } from '@/constant';

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
    } catch (error) {
      try {
        bioTextarea = await canvas.findByPlaceholderText(/bio|about you/i);
        console.log('Found textarea by placeholder');
      } catch (error) {
        console.error('Could not find textarea');
        throw error;
      }
    }

    // Try to type more than 100 characters
    const longInput = 'a'.repeat(MAX_BIO_LENGTH + 1);
    await userEvent.clear(bioTextarea);
    await userEvent.type(bioTextarea, longInput);
  },
};
