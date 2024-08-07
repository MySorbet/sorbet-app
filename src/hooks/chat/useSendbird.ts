import { CONSTANTS } from '@/lib/config';
import SendbirdChat, {
  SendbirdChatParams,
  SendbirdChatWith,
} from '@sendbird/chat';
import {
  GroupChannel,
  GroupChannelModule,
  MessageCollectionInitPolicy,
  MessageFilter,
} from '@sendbird/chat/groupChannel';
import { useQuery } from '@tanstack/react-query';

export const useSendbird = () => {
  return useQuery({
    queryKey: ['sendbird'],
    queryFn: async () => {
      let sb: SendbirdChatWith<GroupChannelModule[]> | null;
      try {
        const params: SendbirdChatParams<[GroupChannelModule]> = {
          appId: CONSTANTS.SendbirdAppId as string,
          localCacheEnabled: true,
          modules: [new GroupChannelModule()],
        };

        sb = SendbirdChat.init(params);
      } catch (error: any) {
        throw new Error(`Failed to initialize Sendbird: ${error}`);
      }
      const initializeConnection = async (userId: string) => {
        try {
          const user = await sb.connect(userId);
          return user;
        } catch (error) {
          console.log(
            `Unable to connect with Sendbird: ${JSON.stringify(error)}`
          );
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
        const channel: GroupChannel = await sb.groupChannel.getChannel(
          channelId
        );

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
    },
  });
};
