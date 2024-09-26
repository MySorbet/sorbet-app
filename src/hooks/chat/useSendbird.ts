import SendbirdChat, { SendbirdChatParams } from '@sendbird/chat';
import {
  GroupChannel,
  GroupChannelModule,
  MessageCollectionInitPolicy,
  MessageFilter,
} from '@sendbird/chat/groupChannel';
import { useQuery } from '@tanstack/react-query';

import { env } from '@/lib/env';

export const useSendbird = () => {
  const { data: sb } = useQuery({
    queryKey: ['sendbird'],
    queryFn: async () => {
      try {
        const params: SendbirdChatParams<[GroupChannelModule]> = {
          appId: env.NEXT_PUBLIC_SEND_BIRD_APP_ID,
          localCacheEnabled: true,
          modules: [new GroupChannelModule()],
        };

        const sb = SendbirdChat.init(params);
        return sb;
      } catch (error: any) {
        console.error('Error initializing sendbird', error);
      }
    },
  });

  if (!sb) {
    return null;
  }

  const initializeConnection = async (userId: string) => {
    try {
      const user = await sb.connect(userId);
      return user;
    } catch (error) {
      console.log(`Unable to connect with Sendbird: ${JSON.stringify(error)}`);
    }
  };
  const removeConnection = async () => {
    try {
      await sb.disconnect();
    } catch (error: any) {
      console.error(`Failed to disconnect from Sendbird: ${error}`);
    }
  };
  const initializeChannelEvents = (channelHandler: any) => {
    const key = 'test';
    sb.groupChannel.addGroupChannelHandler(key, channelHandler);
  };
  const loadMessages = async (channelId: string, messageHandlers: any) => {
    const channel: GroupChannel = await sb.groupChannel.getChannel(channelId);

    const messageFilter = new MessageFilter();

    const messageCollection = channel.createMessageCollection({
      filter: messageFilter,
      startingPoint: Date.now(),
      limit: 30,
    });
    messageCollection.setMessageCollectionHandler(messageHandlers);

    messageCollection.initialize(
      MessageCollectionInitPolicy.CACHE_AND_REPLACE_BY_API
    );

    return { messageCollection, channel };
  };

  return {
    initializeConnection,
    removeConnection,
    initializeChannelEvents,
    loadMessages,
  };
};
