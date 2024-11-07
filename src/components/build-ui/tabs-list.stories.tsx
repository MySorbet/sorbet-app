import { Meta } from '@storybook/react';
import { FileCheck02 } from '@untitled-ui/icons-react';

import { TabsList } from '@/components/build-ui/tabs-list';

const meta = {
  title: 'Components/build-ui/TabsList',
  component: TabsList,
  args: {
    tabs: [
      { name: 'Chat' },
      { name: 'Contract', icon: <FileCheck02 className='h-4 w-4' /> },
    ],
  },
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => {
      return (
        <div className='flex h-40 w-[600px] items-center justify-center rounded-xl bg-[#FAFAFA]'>
          <Story />
        </div>
      );
    },
  ],
} satisfies Meta<typeof TabsList>;

export default meta;
export const Default = {};
