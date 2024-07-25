'use client';

import { Chat } from './chat';
import {
  initializeChannelEvents,
  initializeConnection,
  loadMessages,
  timestampToTime,
} from './sendbird';
import { sendNotification } from '@/api/chat';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks';
import {
  NewMessageNotificationDto,
  SBFileMessage,
  SBMessage,
} from '@/types/sendbird';
import {
  GroupChannel,
  GroupChannelHandler,
  Member,
  MessageCollectionEventHandler,
} from '@sendbird/chat/groupChannel';
import { MessageListParams } from '@sendbird/chat/message';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';

interface ChatLayoutProps {
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
  channelId: string;
  contractId: string;
}

export function ChatLayoutMinimal({
  defaultLayout = [320, 480],
  defaultCollapsed = false,
  navCollapsedSize,
  channelId,
  contractId,
}: ChatLayoutProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const [isMobile, setIsMobile] = useState(false);
  const [state, updateState] = useState({
    currentlyJoinedChannel: null,
    messages: [],
    typingMembers: [],
    messageCollection: null,
  });
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const stateRef = useRef<any>();
  stateRef.current = state;

  const messageHandlers: MessageCollectionEventHandler = {
    onMessagesAdded: async (context: any, channel: any, messages: any) => {
      // a check to see if the recipient is offline or online
      // connectionStatus is determined if there is an active connection to Sendbird
      const recipient = channel.members.find(
        (member: any) => member.userId !== user?.id
      );
      const sender = channel.members.find(
        (member: any) => member.userId === user?.id
      );
      if (recipient.connectionStatus === 'offline') {
        const params: NewMessageNotificationDto = {
          reqContractId: contractId,
          reqChannelId: channelId,
          reqSenderId: sender.userId,
          reqRecipientId: recipient.userId,
        };
        sendNotification(params);
      }
      // Updating state to render messages
      messages.forEach((currentMessage: any) => {
        const messageToAdd: SBMessage = {
          userId: currentMessage.sender.userId,
          message: currentMessage.message,
          nickname: currentMessage.sender.nickname,
          avatar: currentMessage.sender.plainProfileUrl,
          timestampData: timestampToTime(Date.now()),
        };
        if (currentMessage.messageType === 'file') {
          // This if block is for when a user sends a message
          // set Sendbird url to a object url blob because the fileUrl key is not accessible though it's defined if you log the currentMessage object
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
            // This else block is for when a user receives a message
            const fileData: SBFileMessage = {
              name: currentMessage.name,
              sendbirdUrl: currentMessage.plainUrl,
              type: currentMessage.type,
              size: currentMessage.size,
            };
            messageToAdd.fileData = fileData;
          }
        }
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
    let timeoutId: NodeJS.Timeout | undefined;
    async function initializeChat() {
      if (!user) {
        // handle unauthenticated user
        toast({
          title: 'You are not authenticated',
          description: 'Redirecting to login page',
          variant: 'destructive',
        });
        timeoutId = setTimeout(() => {
          logout();
        }, 3000);
        return;
      }

      await initializeConnection(user.id);

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

    return () => {
      if (timeoutId) return clearTimeout(timeoutId);
    };
  }, [channelId, user]);

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
