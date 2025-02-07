import type { Meta, StoryObj } from '@storybook/react';

import { mockBridgeCustomer } from '@/api/bridge/mock-bridge-customer';

import { PersonaCard } from './persona-card';

type Story = StoryObj<typeof PersonaCard>;

const meta = {
  title: 'Verify/PersonaCard',
  component: PersonaCard,
  parameters: {
    layout: 'centered',
  },
  args: {
    url: mockBridgeCustomer.kyc_link,
  },
} satisfies Meta<typeof PersonaCard>;

export default meta;

export const Default: Story = {};
