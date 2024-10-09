import { File, ImageIcon } from 'lucide-react';

import { useAuth } from '@/hooks';
import { useChat } from '@/hooks/chat/useChat';
import { useGetOffer } from '@/hooks/gigs/useGetOffer';

import ChatBottombar from './chat-bottombar';
import { ChatList } from './chat-list';
import ChatTopbar from './chat-topbar';

const icons = {
  pdf: <File className='h-5 w-5 text-white' />,
  jpeg: <ImageIcon className='h-5 w-5 text-white' />,
  png: <ImageIcon className='h-5 w-5 text-white' />,
};
import { useEffect } from 'react';
import { GroupChannelProvider } from '@sendbird/uikit-react/GroupChannel/context';
import { useGroupChannelContext } from '@sendbird/uikit-react/GroupChannel/context';

type SupportedFileIcon = keyof typeof icons;

interface ChatProps {
  showTopbar?: boolean;
  isOpen: boolean;
  offerId: string;
  contractStatus: string;
  loggedInUserId: string;
}

export function Chat({
  showTopbar = true,
  isOpen,
  offerId,
  contractStatus = '',
  loggedInUserId,
}: ChatProps) {
  const { user } = useAuth();

  const { data: offer, isLoading: isOfferLoading } = useGetOffer(offerId);

  const { sendMessage, getChannelData, sendFileMessage } = useChat(
    loggedInUserId,
    offer?.channelId,
    isOfferLoading
  );

  const { data: channel } = getChannelData;

  return (
    <div className='flex h-full w-full flex-col justify-between rounded-2xl bg-gray-100 p-2 py-3 '>
      {showTopbar && <ChatTopbar selectedUser={user} />}

      {channel && (
        <GroupChannelProvider
          channelUrl={channel.url}
          messageListQueryParams={{}}
        >
          <ChatList
            loggedInUserId={loggedInUserId}
            typingMembers={[]}
            supportedIcons={icons}
            chatLoading={false}
          />
          <div className='mt-4'>
            <ChatBottombar
              sendMessage={sendMessage}
              sendFileMessage={sendFileMessage}
              isMobile={false}
              channel={channel}
              contractStatus={contractStatus}
              supportedIcons={icons}
            />
          </div>
        </GroupChannelProvider>
      )}
    </div>
  );
}
