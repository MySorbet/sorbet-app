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

/**
  Connects the current user to Sendbird servers
*/
const initializeConnection = async (userId: string) => {
  try {
    const user = await sb.connect(userId);
    return user;
  } catch (error: any) {
    console.error(`Failed to connect to Sendbird: ${error}`);
    throw new Error('Failed to connect to Sendbird');
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
    limit: 30,
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

  return `${newHour}:${minute} ${suffix}`;
};

const createChatTimestamp = ({
  year,
  month,
  day,
  hour,
  minute,
  second,
}: SBMessageTimeDto) => {
  // Parse the components to integers
  const dayInt = parseInt(day, 10);
  const hourInt = parseInt(hour, 10);
  const minuteInt = parseInt(minute, 10);
  const monthInt = parseInt(month, 10) - 1; // JavaScript months are 0-indexed
  const secondInt = parseInt(second, 10);
  const yearInt = parseInt(year, 10);

  // Create a Date object from the provided components
  const date = new Date(
    yearInt,
    monthInt,
    dayInt,
    hourInt,
    minuteInt,
    secondInt
  );

  // Get current date
  const now = new Date();

  // Helper function to check if two dates are the same day
  const isSameDay = (d1: Date, d2: Date): boolean =>
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();

  // Format the time
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12; // Convert to 12-hour format, 0 should be 12
  const formattedTime = `${hours}:${minutes} ${ampm}`;

  // Check if the date is today
  if (isSameDay(date, now)) {
    return `Today ${formattedTime}`;
  }

  // Check if the date is yesterday
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (isSameDay(date, yesterday)) {
    return `Yesterday ${formattedTime}`;
  }

  // Check if the date is within the current week
  const dayDifference = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (dayDifference < 7) {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return `${daysOfWeek[date.getDay()]} ${formattedTime}`;
  }

  // If not today, yesterday, or within this week, return the full date
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return `${formattedDate} ${formattedTime}`;
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
  createChatTimestamp,
  loadMessages,
  initializeConnection,
  timestampToTime,
  convertMilitaryToRegular,
  initializeChannelEvents,
  formatBytes,
  getTimeDifferenceInMinutes,
  removeConnection,
};
