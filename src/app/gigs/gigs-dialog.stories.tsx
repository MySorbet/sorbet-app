import { useArgs } from '@storybook/preview-api';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { OfferType } from '@/types';

import { GigsDialog } from './gigs-dialog';

const meta: Meta<typeof GigsDialog> = {
  title: 'Gigs/GigsDialog',
  component: GigsDialog,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  render: (args) => {
    const [{ isOpen }, updateArgs] = useArgs();
    const handleSetOpen = (isOpen: boolean) => {
      updateArgs({ isOpen });
    };
    return (
      <GigsDialog {...args} isOpen={isOpen} onOpenChange={handleSetOpen} />
    );
  },
  args: {
    isOpen: true,
  },
};

export default meta;
type Story = StoryObj<typeof GigsDialog>;

const mockOffer: OfferType = {
  id: '1',
  name: 'John Doe',
  username: 'johndoe',
  profileImage: '',
  projectName: 'Web Development Project',
  status: 'Pending',
  projectStart: '2023-07-01',
  budget: '5000-10000',
  tags: ['web', 'development'],
  projectDescription: 'A comprehensive web development project',
};

export const Default: Story = {
  args: {
    isClient: true,
    currentOffer: mockOffer,
    handleRejectOffer: fn(),
    afterContractSubmitted: fn(),
    currentOfferId: mockOffer.id,
  },
};
