'use client';

import { Chat } from './chat';
import { Message, userData } from './data';
import { useAuth } from '@/hooks';
import { SBMessage } from '@/types/sendbird';
import {
  initializeConnection,
  loadMessages,
  timestampToTime,
} from '@/utils/sendbird';
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

  const messageHandlers = {
    onMessagesAdded: (context: any, channel: any, messages: any) => {
      console.log('onMessagesAdded', messages);
      messages.forEach((currentMessage: any) => {
        const messageToAdd = {
          userId: currentMessage.sender.userId,
          message: currentMessage.message,
          nickname: currentMessage.sender.nickname,
          avatar: currentMessage.sender.plainProfileUrl,
        };
        const updatedMessages = [...stateRef.current.messages, messageToAdd];
        updateState({ ...stateRef.current, messages: updatedMessages });
      });
    },
  };

  useEffect(() => {
    async function initializeChat() {
      const sbuser = await initializeConnection(user?.id);

      if (channelId) {
        const { collection, channel } = await loadMessages(
          channelId,
          messageHandlers
        );
        const ts = Date.now();
        const messageListParams: MessageListParams = {
          prevResultSize: 20,
          nextResultSize: 0,
          isInclusive: true,
        };

        const latestMessages = await channel.getMessagesByTimestamp(
          ts,
          messageListParams
        );

        const fetchedMessages = latestMessages.map((currentMessage: any) => {
          const time = timestampToTime(currentMessage.createdAt);
          return {
            userId: currentMessage.sender.userId,
            message: currentMessage.message,
            nickname: currentMessage.sender.nickname,
            avatar: currentMessage.sender.plainProfileUrl,
            timestampData: time,
          };
        });

        updateState({
          ...stateRef.current,
          messageCollection: collection,
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
    />
  );
}
