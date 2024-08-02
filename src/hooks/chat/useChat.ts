'use client';

import { sendNotification } from '@/api/chat';
import {
  initializeChannelEvents,
  initializeConnection,
  loadMessages,
  removeConnection,
  timestampToTime,
} from '@/app/gigs/chat/sendbird';
import { useToast } from '@/components/ui/use-toast';
import { ContractType, User } from '@/types';
import {
  ChatState,
  NewMessageNotificationDto,
  SBFileMessage,
  SBMessage,
  SendMessageParams,
} from '@/types/sendbird';
import {
  GroupChannelHandler,
  type GroupChannel,
  type MessageCollectionEventHandler,
} from '@sendbird/chat/groupChannel';
import { MessageListParams } from '@sendbird/chat/message';
import { useEffect, useRef, useState } from 'react';

interface useInitializeChatProps {
  user: User | null;
  logout: () => void;
  contractData: ContractType;
  isOpen: boolean;
}

export const useChat = ({
  user,
  logout,
  contractData,
  isOpen,
}: useInitializeChatProps) => {
  const { toast } = useToast();
  const [state, updateState] = useState<ChatState>({
    channel: null,
    messages: [],
    typingMembers: [],
    messageCollection: null,
  });
  const [loading, setLoading] = useState<boolean>(false);

  const stateRef = useRef<any>(null);
  stateRef.current = state;

  const messageHandlers: MessageCollectionEventHandler = {
    // Channel will always be defined whenever this event is triggered bc it is triggered thru sendbird and
    // only runs when a channel is successfully found between two users
    onMessagesAdded: async (context, channel, messages) => {
      // Need to refresh because the channel object is not updated with the new messages
      // TODO: This is a quick fix, need to look into finding a better solution
      await channel.refresh();
      // The user will always be the sender, we are just trying to get the id of the recipient so we can check online status
      const senderId = user?.id;
      const recipientId =
        user?.id === contractData.clientId
          ? contractData.freelanceId
          : contractData.clientId;
      const sender = channel.members.find(
        (member: any) => member.userId === senderId
      );
      if (!sender) {
        console.error('Sender not found in channel members');
        toast({
          title: 'Authentication error',
          description: 'Please contact support for assistance',
          variant: 'destructive',
        });
        return;
      }
      const recipient = channel.members.find(
        (member: any) => member.userId === recipientId
      );
      if (!recipient) {
        console.error('Recipient not found in channel members');
        toast({
          title: 'Authentication error',
          description: 'Please contact support for assistance',
          variant: 'destructive',
        });
        return;
      }
      if (recipient.connectionStatus === 'offline') {
        const params: NewMessageNotificationDto = {
          reqContractId: contractData.id,
          reqChannelId: contractData.channelId,
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

  const sendMessage = (newMessage: SendMessageParams) => {
    if (!state.channel) return;

    if (newMessage.type === 'file') {
      const params = {
        file: newMessage.message[0],
        name: newMessage.message[0].name,
        type: newMessage.message[0].type,
      };
      state.channel
        .sendFileMessage(params)
        .onSucceeded((fileMessageParams) => {
          if (state.channel) {
            state.channel.endTyping();
          }
        })
        .onFailed((error) => {
          console.log('message failed : ', error);
        });
    } else {
      state.channel
        .sendUserMessage({ message: newMessage.message })
        .onSucceeded((message) => {
          if (state.channel) {
            state.channel.endTyping();
          }
        })
        .onFailed((error) => {
          console.log('message failed : ', error);
        });
    }
  };

  useEffect(() => {
    async function disconnectSendbird() {
      await removeConnection();
    }

    if (!isOpen) {
      disconnectSendbird();
    }
  }, [isOpen]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | undefined;
    async function initializeChat() {
      if (!user) {
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
      setLoading(true);
      await initializeConnection(user.id);

      initializeChannelEvents(channelHandlers);

      const { messageCollection, channel } = await loadMessages(
        contractData.channelId,
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
        setLoading(false);
        return message;
      });

      updateState({
        ...stateRef.current,
        messageCollection: messageCollection,
        channel: channel,
        messages: fetchedMessages,
      });
    }

    initializeChat();

    return () => {
      if (timeoutId) {
        return clearTimeout(timeoutId);
      }
    };
  }, [user, contractData]);

  return [state,  loading, sendMessage] as [
    ChatState,
    boolean,
    typeof sendMessage
  ];
};

// Somehow the channel is not live updating
