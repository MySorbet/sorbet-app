import type { Meta, StoryObj } from '@storybook/react';
import { PersonaIframe } from './persona-iframe';

type Story = StoryObj<typeof PersonaIframe>;

const meta = {
  title: 'Verify/PersonaIframe',
  component: PersonaIframe,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof PersonaIframe>;

export default meta;

export const Default: Story = {};
