import { CONSTANTS } from '@/lib/config';
import { SBMessageTimeDto } from '@/types/sendbird';
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

// Initialize the SendbirdChat module
const params: SendbirdChatParams<[GroupChannelModule]> = {
  appId: CONSTANTS.SendbirdAppId as string,
  localCacheEnabled: true,
  modules: [new GroupChannelModule()],
};

const sb: SendbirdChatWith<GroupChannelModule[]> = SendbirdChat.init(params);

/**
  Connects the current user to Sendbird servers
*/
const initializeConnection = async (userId: string) => {
  try {
    const user = await sb.connect(userId);
    return user;
  } catch (error) {
    console.log(`Unable to connect with Sendbird: ${JSON.stringify(error)}`);
  }
};

/**
  Terminates the connection of the current user to Sendbird servers
*/
const removeConnection = async () => {
  try {
    await sb.disconnect();
  } catch (error: any) {
    console.error(`Failed to disconnect from Sendbird: ${error}`);
  }
};

/**
  Creates a channel handler to handle specific events for a channel.

  Currently only using for onTypingStatusUpdated event because it is not accessible in MessageCollection.
*/
const initializeChannelEvents = (channelHandler: any) => {
  const key = 'test';
  sb.groupChannel.addGroupChannelHandler(key, channelHandler);
};

/**
  Fetches last 100 messages for a specific channel from Sendbird and initializes a message collection.
*/
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

/**
  Converts milliseconds to a formatted date and time object for easier display.
*/
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

/**
  Converts military time to regular time with AM/PM suffix.
  @params hour - The hour in military time, minutes - The minutes in military time
  @returns string in regular time with AM/PM suffix
*/
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

/**
  Formats bytes to a human readable format.
*/
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
  removeConnection,
};
