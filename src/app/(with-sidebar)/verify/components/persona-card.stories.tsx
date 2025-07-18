import type { Meta, StoryObj } from '@storybook/react';

import { mockBridgeCustomer } from '@/api/bridge/mock-bridge-customer';

import { PersonaCard } from './persona-card';

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
type Story = StoryObj<typeof meta>;

// Render error if the inquiry template id is not found in the url
export const Error: Story = {
  args: {
    url: mockBridgeCustomer.kyc_link.replace(
      /[?&]inquiry-template-id=[^&]*/,
      ''
    ),
  },
};
