import { Meta } from '@storybook/react';
import { userEvent, within } from '@storybook/test';

import { MAX_BIO_LENGTH } from '@/constant';

import { Step2 } from './step2';
import { UserSignUpDecorator } from './user-signup.decorator';

const meta = {
  title: 'Onboarding/Step2',
  component: Step2,
  parameters: {
    layout: 'centered',
  },
  decorators: [UserSignUpDecorator],
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
