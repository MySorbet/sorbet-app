import { CONSTANTS } from '@/lib/config';
import { SBMessageTimeDto } from '@/types/sendbird';
import SendbirdChat, {
  SendbirdChatParams,
  SendbirdChatWith,
} from '@sendbird/chat';
import {
  GroupChannelModule,
  MessageFilter,
  MessageCollectionInitPolicy,
  GroupChannel,
} from '@sendbird/chat/groupChannel';

// Initialize the SendbirdChat module
const params: SendbirdChatParams<[GroupChannelModule]> = {
  appId: CONSTANTS.SendbirdAppId as string,
  localCacheEnabled: true,
  modules: [new GroupChannelModule()],
};

const sb: SendbirdChatWith<GroupChannelModule[]> = SendbirdChat.init(params);

// Call when user clicks on a gig and renders chat component
const initializeConnection = async (userId: string) => {
  try {
    const user = await sb.connect(userId);
    return user;
  } catch (error: any) {
    throw new Error('Failed to connect to Sendbird');
  }
};

// Specifically for onTypingStatusUpdated event. Event is not accessible in MessageCollection like onMessagesAdded is.
// Only accessible through a GroupChannelHandler
const initializeChannelEvents = (channelHandler: any) => {
  const key = 'test';
  sb.groupChannel.addGroupChannelHandler(key, channelHandler);
};

// Calls to Sendbird and fetches last 100 messages for a specific channel
// messageCollection currently unused, but may be needed later so I left it in just in case
const loadMessages = async (channelId: string, messageHandlers: any) => {
  const channel: GroupChannel = await sb.groupChannel.getChannel(channelId);

  const messageFilter = new MessageFilter();

  const messageCollection = channel.createMessageCollection({
    filter: messageFilter,
    startingPoint: Date.now(),
    limit: 100,
  });
  messageCollection.setMessageCollectionHandler(messageHandlers);

  messageCollection.initialize(
    MessageCollectionInitPolicy.CACHE_AND_REPLACE_BY_API
  );

  return { messageCollection, channel };
};

const timestampToTime = (timestamp: number) => {
  // Convert milliseconds to a Date object
  const date = new Date(timestamp);

  // Format the date
  const year = date.getFullYear().toString();
  const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are zero-based
  const day = ('0' + date.getDate()).slice(-2);
  const hour = ('0' + date.getHours()).slice(-2);
  const minute = ('0' + date.getMinutes()).slice(-2);
  const second = ('0' + date.getSeconds()).slice(-2);

  // Return formatted date and time string
  const timeObject: SBMessageTimeDto = {
    year,
    month,
    day,
    hour,
    minute,
    second,
  };
  return timeObject;
};

const convertMilitaryToRegular = (
  hour: string | undefined,
  minute: string | undefined
) => {
  if (!hour || !minute) return;

  const numHour = Number(hour);
  let newHour: string;
  let suffix: string;

  if (numHour > 12) {
    newHour = String(numHour - 12);
    suffix = 'PM';
  } else if (numHour === 0) {
    newHour = String(12);
    suffix = 'AM';
  } else {
    newHour = hour.substring(1);
    suffix = 'AM';
  }

  return `${newHour}:${minute}${suffix}`;
};

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const convertTimeToMinutes = (timeStr: string) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

const getTimeDifferenceInMinutes = (time1: string, time2: string) => {
  const minutes1 = convertTimeToMinutes(time1);
  const minutes2 = convertTimeToMinutes(time2);

  return Math.abs(minutes2 - minutes1);
};

export {
  sb,
  loadMessages,
  initializeConnection,
  timestampToTime,
  convertMilitaryToRegular,
  initializeChannelEvents,
  formatBytes,
  getTimeDifferenceInMinutes,
};
