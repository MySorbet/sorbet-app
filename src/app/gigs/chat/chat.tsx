import ChatBottombar from './chat-bottombar';
import { ChatList } from './chat-list';
import ChatTopbar from './chat-topbar';
import { ContractStatus, User } from '@/types';
import {
  SBMessage,
  SendMessageParams,
  SupportedFileIcons,
} from '@/types/sendbird';
import { GroupChannel, Member } from '@sendbird/chat/groupChannel';
import { motion } from 'framer-motion';
import { File, ImageIcon } from 'lucide-react';
import React, { Dispatch, SetStateAction } from 'react';

const icons = {
  pdf: <File className='w-5 h-5 text-white' />,
  jpeg: <ImageIcon className='w-5 h-5 text-white' />,
  png: <ImageIcon className='w-5 h-5 text-white' />,
};

type SupportedFileIcon = keyof typeof icons;

interface ChatProps {
  messages: SBMessage[];
  selectedUser: User;
  isMobile: boolean;
  showTopbar?: boolean;
  channel: GroupChannel | undefined | null;
  typingMembers: Member[];
  contractStatus: string;
}

export function Chat({
  messages,
  selectedUser,
  isMobile,
  showTopbar = true,
  channel,
  typingMembers,
  contractStatus,
}: ChatProps) {
  const sendMessage = (newMessage: SendMessageParams) => {
    if (!channel) return;

    if (newMessage.type === 'file') {
      const params = {
        file: newMessage.message[0],
        name: newMessage.message[0].name,
        type: newMessage.message[0].type,
      };
      channel
        .sendFileMessage(params)
        .onSucceeded((fileMessageParams) => {
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
        typingMembers={typingMembers as Member[]}
        contractStatus={contractStatus}
        supportedIcons={icons as SupportedFileIcons}
      />
      <div className='mt-4'>
        <ChatBottombar
          sendMessage={sendMessage}
          isMobile={isMobile}
          channel={channel}
          contractStatus={contractStatus}
          supportedIcons={icons as SupportedFileIcons}
        />
      </div>
    </div>
  );
}
