import ChatBottombar from './chat-bottombar';
import { ChatList } from './chat-list';
import ChatTopbar from './chat-topbar';
import { useAuth } from '@/hooks';
import { useChat } from '@/hooks/chat/useChat';
import { ContractType } from '@/types';
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
  contractData: ContractType;
  isOpen: boolean;
}

export function Chat({ showTopbar = true, contractData, isOpen }: ChatProps) {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const { user, logout } = useAuth();
  const [state, chatLoading, sendMessage] = useChat({
    user,
    logout,
    contractData,
    isOpen,
  });

  // This effect is mainly to disconnect from Sendbird so that when a new message is added, the connectionStatus property is
  // properly being updated when a user closes out of the chat

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    checkScreenWidth();

    // Event listener for screen width changes
    window.addEventListener('resize', checkScreenWidth);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', checkScreenWidth);
    };
  }, []);

  return (
    <div className='flex flex-col justify-between w-full h-full bg-gray-100 p-2 py-3 rounded-2xl '>
      {showTopbar && <ChatTopbar selectedUser={user} />}

      <ChatList
        messages={state.messages}
        selectedUser={user!}
        typingMembers={state.typingMembers}
        contractStatus={contractData.status}
        supportedIcons={icons}
        chatLoading={chatLoading}
      />
      <div className='mt-4'>
        <ChatBottombar
          sendMessage={sendMessage}
          isMobile={isMobile}
          channel={state.channel}
          contractStatus={contractData.status}
          supportedIcons={icons}
        />
      </div>
    </div>
  );
}
