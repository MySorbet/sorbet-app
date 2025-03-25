import type { Meta, StoryObj } from '@storybook/react';
import { fn, screen, userEvent, within } from '@storybook/test';
import { expect } from '@storybook/test';

import { mockContactMeHandler } from '@/api/user/msw-handlers';

import { ContactMeDialog } from './contact-me-dialog';

type Story = StoryObj<typeof ContactMeDialog>;

const meta = {
  title: 'Profile/v2/ContactMeDialog',
  component: ContactMeDialog,
  parameters: {
    layout: 'centered',
    msw: {
      handlers: [mockContactMeHandler], // Comment to hit the local api
    },
  },
  args: {
    open: true,
    onOpenChange: fn(),
    userId: '1',
  },
} satisfies Meta<typeof ContactMeDialog>;

export default meta;

export const Default: Story = {};

export const SubmitMessage: Story = {
  play: async ({ _, step }) => {
    const speedToType = 10;
    const canvas = within(screen.getByRole('dialog'));

    await step('Fill out form', async () => {
      const emailInput = canvas.getByLabelText('Email');
      const subjectInput = canvas.getByLabelText('Subject');
      const messageInput = canvas.getByLabelText('Message');

      await userEvent.type(emailInput, 'test@example.com', {
        delay: speedToType,
      });
      await userEvent.type(subjectInput, 'Project inquiry', {
        delay: speedToType,
      });
      await userEvent.type(
        messageInput,
        'Hi, I need help with a web development project.',
        { delay: speedToType }
      );
    });

    await step('Submit form', async () => {
      // Find the button and wait for it to be enabled
      const submitButton = canvas.getByRole('button', {
        name: /send message/i,
      });

      // Wait for the button to be enabled (not disabled)
      await expect(submitButton).not.toBeDisabled();

      await userEvent.click(submitButton);
    });

    // await step('Verify success state', async () => {
    //   // Wait for success message to appear
    //   const successMessage = await canvas.findByText('Message sent');
    //   expect(successMessage).toBeInTheDocument();
    // });
  },
};
