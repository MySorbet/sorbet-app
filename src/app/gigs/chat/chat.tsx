import ChatBottombar from './chat-bottombar';
import { ChatList } from './chat-list';
import ChatTopbar from './chat-topbar';
import { useAuth } from '@/hooks';
import { useChat } from '@/hooks/chat/useChat';
import { useGetOffer } from '@/hooks/gigs/useGetOffer';
import { File, ImageIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

const icons = {
  pdf: <File className='w-5 h-5 text-white' />,
  jpeg: <ImageIcon className='w-5 h-5 text-white' />,
  png: <ImageIcon className='w-5 h-5 text-white' />,
};

type SupportedFileIcon = keyof typeof icons;

interface ChatProps {
  showTopbar?: boolean;
  isOpen: boolean;
  currentOfferId: string;
  contractStatus: string;
}

export function Chat({ showTopbar = true, isOpen, currentOfferId, contractStatus = '' }: ChatProps) {
  const { user, logout } = useAuth();
  const { data: offerData } = useGetOffer(currentOfferId);
  const [state, chatLoading, error, sendMessage] = useChat({
    user,
    logout,
    isOpen,
    offerData,
  });

  return (
    <div className='flex flex-col justify-between w-full h-full bg-gray-100 p-2 py-3 rounded-2xl '>
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
