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

// Create new sb user
const createSBUser = async (userId: string, nickname: string) => {
  try {
    // Creates new user setting the id with what we pass in
    // Using userId we are storing in our database as the sendbird id
    const user = await sb.connect(userId);
    // true allows users to automatically join group channel without having to call GroupChannel.acceptInvitation()
    await sb.setChannelInvitationPreference(true);
    await sb.updateCurrentUserInfo({ nickname: nickname });
  } catch (error: any) {
    console.log('error creating new user ', error);
  }
};

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

// Create a channel for two users once a gig is created
const createNewChannel = async (
  channelName: string,
  userIdsToInvite: string[]
) => {
  const sortedIds = userIdsToInvite.sort();
  const channelUrl = localStorage.getItem(JSON.stringify(sortedIds));
  if (channelUrl) {
    const channel = await findChannel(channelUrl);
    console.log('channel found! returning channel data', channel);
    return channel;
  }

  console.log('no channels found for these users.');
  console.log('creating a new channel for ', userIdsToInvite);

  try {
    const groupChannelParams: GroupChannelParams = {
      invitedUserIds: [],
      name: '',
      operatorUserIds: [],
    };
    groupChannelParams.invitedUserIds = userIdsToInvite;
    groupChannelParams.name = channelName;
    groupChannelParams.operatorUserIds = userIdsToInvite;
    const channel = await sb.groupChannel.createChannel(groupChannelParams);

    localStorage.setItem(JSON.stringify(sortedIds), channel.url);

    console.log('new channel created for ', userIdsToInvite);
    console.log('channel details ', channel.url);

    return channel;
  } catch (error: any) {
    console.log(
      'error creating channel for: ',
      userIdsToInvite[0],
      userIdsToInvite[1]
    );
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

export { sb, createSBUser, findUser, createNewChannel, loadMessages };
