import type { Meta, StoryObj } from '@storybook/react';

import { PersonaCard } from './persona-card';
import { PERSONA_URL } from './urls';

type Story = StoryObj<typeof PersonaCard>;

const meta = {
  title: 'Verify/PersonaCard',
  component: PersonaCard,
  parameters: {
    layout: 'centered',
  },
  args: {
    url: PERSONA_URL,
  },
} satisfies Meta<typeof PersonaCard>;

export default meta;

export const Default: Story = {};
