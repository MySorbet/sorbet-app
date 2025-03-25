import { File, ImageIcon } from 'lucide-react';

import { useAuth } from '@/hooks';
import { PrismaOfferType, useChat } from '@/hooks/chat/useChat';

import ChatBottombar from './chat-bottombar';
import { ChatList } from './chat-list';
import ChatTopbar from './chat-topbar';

const icons = {
  pdf: <File className='h-5 w-5 text-white' />,
  jpeg: <ImageIcon className='h-5 w-5 text-white' />,
  png: <ImageIcon className='h-5 w-5 text-white' />,
};

type SupportedFileIcon = keyof typeof icons;

interface ChatProps {
  showTopbar?: boolean;
  isOpen: boolean;
  offerId: string;
  contractStatus: string;
}

const fakeOffer: PrismaOfferType = {
  id: '12345',
  projectName: 'Sample Project',
  description: 'This is a sample project description',
  projectStart: 'Immediately',
  status: 'Pending',
  budget: 1000,
  clientId: 'client123',
  freelancerId: 'freelancer456',
  creator: {
    id: 'client123',
    firstName: 'John Doe',
    email: 'john@example.com',
    lastName: '',
    privyId: null,
    handle: null,
    bio: '',
    profileImage: '',
    tags: [],
    city: '',
    hasClaimedHandle: false,
  },
  recipient: {
    id: 'freelancer456',
    firstName: 'Jane Smith',
    email: 'jane@example.com',
    lastName: '',
    privyId: null,
    handle: null,
    bio: '',
    profileImage: '',
    tags: [],
    city: '',
    hasClaimedHandle: false,
  },
  createdAt: '2024-03-20T12:00:00Z',
  updatedAt: '2024-03-20T12:00:00Z',
  channelId: 'channel789',
};

export function Chat({
  showTopbar = true,
  isOpen,
  offerId,
  contractStatus = '',
}: ChatProps) {
  const { user, logout } = useAuth();
  const [state, chatLoading, error, sendMessage] = useChat({
    user,
    logout,
    isOpen,
    offer: fakeOffer,
  });

  return (
    <div className='flex h-full w-full flex-col justify-between rounded-2xl bg-gray-100 p-2 py-3 '>
      {showTopbar && <ChatTopbar selectedUser={user} />}

      <ChatList
        messages={state.messages}
        selectedUser={user!}
        typingMembers={state.typingMembers}
        supportedIcons={icons}
        chatLoading={chatLoading}
      />
      <div className='mt-4'>
        <ChatBottombar
          sendMessage={sendMessage}
          isMobile={false}
          channel={state.channel}
          contractStatus={contractStatus}
          supportedIcons={icons}
        />
      </div>
    </div>
  );
}
