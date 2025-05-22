import { Meta, StoryObj } from '@storybook/react';

import { UploadProofOfAddress } from './upload-proof-of-address';

const meta = {
  title: 'Verify/UploadProofOfAddress',
  component: UploadProofOfAddress,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof UploadProofOfAddress>;

export default meta;

type Story = StoryObj<typeof UploadProofOfAddress>;

export const Default: Story = {};
