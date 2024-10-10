import { Meta, StoryObj } from '@storybook/react';
import { GigsColumn } from '@/app/gigs/gigs-column';
import { GigsCard } from '@/app/gigs/gigs-card';

const args = {
  title: 'Offers',
  count: 3,
};

const meta = {
  title: 'Gigs/GigsColumn',
  component: GigsColumn,
  parameters: {
    layout: 'centered',
    nextjs: {
      appDirectory: true,
    },
  },
  args: args,
  decorators: [
    (Story) => {
      return (
        <div className='w-[300px]'>
          <Story />
        </div>
      );
    },
  ],
} satisfies Meta<typeof GigsColumn>;

export default meta;

type Story = StoryObj<typeof meta>;

const mockGigsCardData = [
  {
    requester: 'Client 1',
    requesterImage: undefined,
    title: 'Gig 1',
    status: 'Pending',
    projectStart: 'Within a week',
    budget: '500-1000',
  },
  {
    requester: 'Client 2',
    requesterImage: undefined,
    title: 'Gig 2',
    status: 'Pending',
    projectStart: 'Within a week',
    budget: '1000-1500',
  },
  {
    requester: 'Client 3',
    requesterImage: undefined,
    title: 'Gig 3',
    status: 'Pending',
    projectStart: 'Within a week',
    budget: '5000-10000',
  },
];

export const Default: Story = {
  render: (args) => {
    return (
      <div>
        <GigsColumn {...args}>
          {mockGigsCardData.map((gig, index) => (
            <GigsCard {...gig} key={index} />
          ))}
        </GigsColumn>
      </div>
    );
  },
};
