import { SENDBIRD_INFO } from '@/constant/constant';
import SendbirdChat, {
  SendbirdChatParams,
  SendbirdChatWith,
} from '@sendbird/chat';
import {
  GroupChannelHandler,
  GroupChannelModule,
  GroupChannelFilter,
  GroupChannelListOrder,
  MessageFilter,
  MessageCollectionInitPolicy,
  SendbirdGroupChat,
  GroupChannelCollection,
  GroupChannelCollectionParams,
  GroupChannelCreateParams,
  GroupChannel,
} from '@sendbird/chat/groupChannel';

interface GroupChannelParams extends GroupChannelCreateParams {
  invitedUserIds: string[];
  name: string;
  operatorUserIds: string[];
} // Initialize the SendbirdChat instance to use APIs in your app.
const params: SendbirdChatParams<[GroupChannelModule]> = {
  appId: SENDBIRD_INFO.appId,
  localCacheEnabled: true,
  modules: [new GroupChannelModule()],
};

const sb: SendbirdChatWith<GroupChannelModule[]> = SendbirdChat.init(params);

const findUser = async (userId: string) => {
  try {
    const queryParams = { userIdsFilter: [userId] };

    const query = sb.createApplicationUserListQuery(queryParams);

    const user = await query.next();

    return user;
  } catch (error: any) {
    console.log('error finding a user ', error);
  }
};

// Check if a channel exists
const findChannel = async (url: string) => {
  const channel: GroupChannel = await sb.groupChannel.getChannel(url);
  return channel;
};

// For sending and receiving messages

const loadMessages = async (channel: GroupChannel, messageHandlers: any) => {
  const messageFilter = new MessageFilter();

  const collection = channel.createMessageCollection({
    filter: messageFilter,
    startingPoint: Date.now(),
    limit: 20,
  });

  collection.setMessageCollectionHandler(messageHandlers);

  collection.initialize(MessageCollectionInitPolicy.CACHE_AND_REPLACE_BY_API);

  return collection;
};

export { sb, findUser, loadMessages, findChannel };
