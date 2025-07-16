import { Meta, StoryObj } from '@storybook/react';

import { PAYMENT_TIMING_DESCRIPTIONS } from '@/app/invoices/utils';

import {
  RecipientButton,
  RecipientButtonContent,
  RecipientButtonDescription,
  RecipientButtonDetail,
  RecipientButtonIcon,
  RecipientButtonTitle,
} from './recipient-button';

/**
 * Decorator that wraps a story in a horizontally resizable container
 */
const withResizableContainer = (Story: React.ComponentType) => (
  <div
    style={{
      resize: 'horizontal',
      overflow: 'auto',
      minWidth: '200px',
      maxWidth: '800px',
      padding: '1rem',
      border: '1px dashed #ccc',
    }}
  >
    <Story />
  </div>
);

const meta = {
  title: 'Recipients/RecipientButton',
  component: RecipientButton,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof RecipientButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <RecipientButton {...args}>
      <RecipientButtonIcon type='bank' />
      <RecipientButtonContent>
        <RecipientButtonTitle>Recipient</RecipientButtonTitle>
        <RecipientButtonDescription>
          A message about the recipient
        </RecipientButtonDescription>
        <RecipientButtonDetail>A little note</RecipientButtonDetail>
      </RecipientButtonContent>
    </RecipientButton>
  ),
};

export const Resizable: Story = {
  parameters: {
    layout: 'padded',
  },
  render: Default.render,
  decorators: [withResizableContainer],
};

export const Bank: Story = {
  render: (args) => (
    <RecipientButton {...args}>
      <RecipientButtonIcon type='bank' />
      <RecipientButtonContent>
        <RecipientButtonTitle>Bank recipient</RecipientButtonTitle>
        <RecipientButtonDescription>
          Transfer to a business or individual bank
        </RecipientButtonDescription>
        <RecipientButtonDetail>
          {PAYMENT_TIMING_DESCRIPTIONS.bank}
        </RecipientButtonDetail>
      </RecipientButtonContent>
    </RecipientButton>
  ),
};

export const Wallet: Story = {
  render: (args) => (
    <RecipientButton {...args}>
      <RecipientButtonIcon type='wallet' />
      <RecipientButtonContent>
        <RecipientButtonTitle>Crypto wallet</RecipientButtonTitle>
        <RecipientButtonDescription>
          Transfer to crypto wallet or exchange
        </RecipientButtonDescription>
        <RecipientButtonDetail>
          {PAYMENT_TIMING_DESCRIPTIONS.crypto}
        </RecipientButtonDetail>
      </RecipientButtonContent>
    </RecipientButton>
  ),
};
