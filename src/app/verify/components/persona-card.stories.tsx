import type { Meta, StoryObj } from '@storybook/react';

import { PersonaCard } from './persona-card';

type Story = StoryObj<typeof PersonaCard>;

const meta = {
  title: 'Verify/PersonaCard',
  component: PersonaCard,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof PersonaCard>;

export default meta;

export const Default: Story = {};
