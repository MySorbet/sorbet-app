import { Meta } from '@storybook/react';
import { fn } from '@storybook/test';
import { File, ImageIcon } from 'lucide-react';

import ChatBottombar from '@/app/gigs/chat/chat-bottombar';

const meta = {
  title: 'Chat/ChatBottomBar',
  component: ChatBottombar,
  args: {
    sendMessage: fn(),
    isMobile: false,
    channel: undefined,
    contractStatus: 'Pending',
    supportedIcons: {
      pdf: <File className='h-5 w-5 text-white' />,
      jpeg: <ImageIcon className='h-5 w-5 text-white' />,
      png: <ImageIcon className='h-5 w-5 text-white' />,
    },
  },
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => {
      return (
        <div className='w-[900px] rounded-xl bg-gray-100'>
          <Story />
        </div>
      );
    },
  ],
} satisfies Meta<typeof ChatBottombar>;

export default meta;

export const Default = {};
