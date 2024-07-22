import { ChatList } from './chat-list';
import ChatTopbar from './chat-topbar';
import { Message, UserData } from './data';
import { User } from '@/types';
import { SBMessage } from '@/types/sendbird';
import { GroupChannel, Member } from '@sendbird/chat/groupChannel';
import React, { Dispatch, SetStateAction } from 'react';

interface ChatProps {
  messages?: SBMessage[];
  selectedUser: User;
  isMobile: boolean;
  showTopbar?: boolean;
  channel: GroupChannel | undefined | null;
  typingMembers?: Member[];
}

export function Chat({
  messages,
  selectedUser,
  isMobile,
  showTopbar = true,
  channel,
  typingMembers,
}: ChatProps) {
  const sendMessage = (newMessage: SBMessage) => {
    if (!channel) return;

    if (newMessage.file && newMessage.file.length === 1) {
      const params = {
        file: newMessage.file[0],
        name: newMessage.file[0].name,
        type: newMessage.file[0].type,
      };
      channel
        .sendFileMessage(params)
        .onSucceeded(() => {
          channel.endTyping();
        })
        .onFailed((error) => {
          console.log('message failed : ', error);
        });
    } else {
      channel
        .sendUserMessage({ message: newMessage.message })
        .onSucceeded((message) => {
          channel.endTyping();
        })
        .onFailed((error) => {
          console.log('message failed : ', error);
        });
    }
  };

  return (
    <div className='flex flex-col justify-between w-full h-full bg-gray-100 p-2 py-3 rounded-2xl '>
      {showTopbar && <ChatTopbar selectedUser={selectedUser} />}

      <ChatList
        messages={messages}
        selectedUser={selectedUser}
        sendMessage={sendMessage}
        isMobile={isMobile}
        channel={channel}
        typingMembers={typingMembers as Member[]}
      />
    </div>
  );
}
