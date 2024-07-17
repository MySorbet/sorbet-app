import { ChatList } from './chat-list';
import ChatTopbar from './chat-topbar';
import { Message, UserData } from './data';
import { User } from '@/types';
import { SBMessage } from '@/types/sendbird';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import React, { Dispatch, SetStateAction } from 'react';

interface ChatProps {
  messages?: SBMessage[];
  selectedUser: User;
  isMobile: boolean;
  showTopbar?: boolean;
  channel: GroupChannel | undefined | null;
}

export function Chat({
  messages,
  selectedUser,
  isMobile,
  showTopbar = true,
  channel,
}: ChatProps) {
  console.log('Messages from chat ', messages);

  const sendMessage = (newMessage: SBMessage) => {
    if (!channel) return;
    channel
      .sendUserMessage({ message: newMessage.message })
      .onSucceeded((message) => {})
      .onFailed((error) => {
        console.log('message failed : ', error);
      });
  };

  return (
    <div className='flex flex-col justify-between w-full h-full bg-gray-100 p-2 py-3 rounded-2xl '>
      {showTopbar && <ChatTopbar selectedUser={selectedUser} />}

      <ChatList
        messages={messages}
        selectedUser={selectedUser}
        sendMessage={sendMessage}
        isMobile={isMobile}
      />
    </div>
  );
}
