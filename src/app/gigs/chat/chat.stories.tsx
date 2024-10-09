import { Meta } from '@storybook/react';

import { Chat } from '@/app/gigs/chat/chat';
import { ChatDecorator } from '@/app/gigs/chat/chat-decorator';

const meta = {
  title: 'Chat/Chat',
  component: Chat,
  args: {},
  parameters: {
    layout: 'centered',
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [ChatDecorator],
} satisfies Meta<typeof Chat>;

export default meta;

export const Default = {};
