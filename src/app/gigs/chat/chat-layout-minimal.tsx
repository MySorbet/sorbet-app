'use client';

import { Chat } from './chat';
import { Message, userData } from './data';
import { useAuth } from '@/hooks';
import { SBFileMessage, SBMessage } from '@/types/sendbird';
import {
  initializeChannelEvents,
  initializeConnection,
  loadMessages,
  timestampToTime,
} from '@/utils/sendbird';
import {
  GroupChannel,
  GroupChannelHandler,
  Member,
  MessageCollectionEventHandler,
} from '@sendbird/chat/groupChannel';
import { MessageListParams } from '@sendbird/chat/message';
import React, { useEffect, useRef, useState } from 'react';

interface ChatLayoutProps {
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
  channelId?: string;
}

export function ChatLayoutMinimal({
  defaultLayout = [320, 480],
  defaultCollapsed = false,
  navCollapsedSize,
  channelId,
}: ChatLayoutProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const [selectedUser, setSelectedUser] = React.useState(userData[0]);
  const [isMobile, setIsMobile] = useState(false);
  const [state, updateState] = useState({
    applicationUsers: [],
    groupChannelMembers: [],
    currentlyJoinedChannel: null,
    messages: [],
    channels: [],
    messageInputValue: '',
    userNameInputValue: '',
    userIdInputValue: '',
    channelNameUpdateValue: '',
    settingUpUser: true,
    file: null,
    messageToUpdate: null,
    typingMembers: [],
    messageCollection: null,
    loading: false,
    error: false,
  });
  const { user } = useAuth();
  const stateRef = useRef<any>();
  stateRef.current = state;

  const messageHandlers: MessageCollectionEventHandler = {
    onMessagesAdded: (context: any, channel: any, messages: any) => {
      console.log(context);
      messages.forEach((currentMessage: any) => {
        const messageToAdd: SBMessage = {
          userId: currentMessage.sender.userId,
          message: currentMessage.message,
          nickname: currentMessage.sender.nickname,
          avatar: currentMessage.sender.plainProfileUrl,
          timestampData: timestampToTime(Date.now()),
        };
        console.log('current message', currentMessage);
        if (currentMessage.messageType === 'file') {
          console.log('in fille message');
          if (currentMessage.messageParams !== null) {
            const fileData: SBFileMessage = {
              name: currentMessage.messageParams.file.name,
              sendbirdUrl: URL.createObjectURL(
                currentMessage.messageParams.file
              ),
              type: currentMessage.messageParams.file.type,
              size: currentMessage.messageParams.file.size,
            };
            messageToAdd.fileData = fileData;
          } else {
            const fileData: SBFileMessage = {
              name: currentMessage.name,
              sendbirdUrl: currentMessage.plainUrl,
              type: currentMessage.type,
              size: currentMessage.size,
            };
            messageToAdd.fileData = fileData;
          }
        }
        console.log('messageToAdd', messageToAdd);
        const updatedMessages = [...stateRef.current.messages, messageToAdd];
        updateState({ ...stateRef.current, messages: updatedMessages });
      });
    },
  };

  const channelHandlers = new GroupChannelHandler({
    onTypingStatusUpdated: (groupChannel: GroupChannel) => {
      const typingUsers = groupChannel.getTypingUsers();

      updateState({ ...stateRef.current, typingMembers: typingUsers });
    },
  });

  useEffect(() => {
    async function initializeChat() {
      await initializeConnection(user?.id);

      initializeChannelEvents(channelHandlers);

      if (channelId) {
        const { messageCollection, channel } = await loadMessages(
          channelId,
          messageHandlers
        );

        const ts = Date.now();
        const messageListParams: MessageListParams = {
          prevResultSize: 100,
          nextResultSize: 0,
          isInclusive: true,
        };

        const latestMessages = await channel.getMessagesByTimestamp(
          ts,
          messageListParams
        );

        const fetchedMessages = latestMessages.map((currentMessage: any) => {
          // console.log('fetched messages', currentMessage);
          const time = timestampToTime(currentMessage.createdAt);
          const message: SBMessage = {
            userId: currentMessage.sender.userId,
            message: currentMessage.message,
            nickname: currentMessage.sender.nickname,
            avatar: currentMessage.sender.plainProfileUrl,
            timestampData: time,
          };
          if (currentMessage.plainUrl) {
            const fileData: SBFileMessage = {
              name: currentMessage.name,
              sendbirdUrl: currentMessage.plainUrl,
              type: currentMessage.type,
              size: currentMessage.size,
            };
            message.fileData = fileData;
          }
          return message;
        });

        updateState({
          ...stateRef.current,
          messageCollection: messageCollection,
          currentlyJoinedChannel: channel,
          messages: fetchedMessages,
        });
      }
    }

    initializeChat();
  }, [channelId]);

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
    <Chat
      messages={state.messages}
      selectedUser={user!}
      isMobile={isMobile}
      showTopbar={false}
      channel={state.currentlyJoinedChannel}
      typingMembers={state.typingMembers as Member[]}
    />
  );
}
