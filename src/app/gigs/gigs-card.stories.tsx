import { Meta } from '@storybook/react';
import { fn } from '@storybook/test';

import { GigsCard } from '@/app/gigs/gigs-card';

const args = {
  requester: 'Name of client',
  requesterImage: undefined,
  title: 'Example Gig',
  status: 'Pending',
  projectStart: 'Within a week',
  budget: '500-1000',
};

const meta = {
  title: 'Gigs/GigsCard',
  component: GigsCard,
  parameters: {
    layout: 'centered',
    nextjs: {
      appDirectory: true,
    },
  },
  args: { ...args },
  decorators: [
    (Story) => {
      return (
        <div className='w-[284px]'>
          <Story />
        </div>
      );
    },
  ],
} satisfies Meta<typeof GigsCard>;

export default meta;

export const Default = {};
