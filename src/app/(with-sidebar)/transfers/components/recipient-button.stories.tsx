import { Meta, StoryObj } from '@storybook/react';

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
  title: 'Transfers/RecipientButton',
  component: RecipientButton,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof RecipientButton>;

export default meta;

type Story = StoryObj<typeof RecipientButton>;

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
          Arrives in 1-2 business days
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
        <RecipientButtonDetail>Arrives instantly</RecipientButtonDetail>
      </RecipientButtonContent>
    </RecipientButton>
  ),
};
