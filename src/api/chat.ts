import axios from 'axios';
import * as blobUtil from 'blob-util';

import { env } from '@/lib/env';
import { NewMessageNotificationDto } from '@/types/sendbird';

import { withAuthHeader } from './withAuthHeader';

const API_URL = env.NEXT_PUBLIC_SORBET_API_URL;

/**
  Fetches the files stored in Sendbird with proper api tokens in the backend and returns the blob url
  @params sendbirdUrl: string - the url of the file stored in Sendbird
  @params type: string - the type of the file
  @returns blobUrl: string - the blob url of the file
  @throws Error: if request fails
*/
export async function fetchFile(sendbirdUrl: string, type: string) {
  if (sendbirdUrl.includes('blob:')) {
    return sendbirdUrl;
  }
  const reqBody = { url: sendbirdUrl };

  try {
    const response = await axios.post(
      `${API_URL}/images/sendbird`,
      reqBody,
      await withAuthHeader()
    );
    const binary = response.data.binString;
    const buffer = blobUtil.binaryStringToArrayBuffer(binary);
    const blob = new Blob([buffer], { type: type });
    const blobUrl = URL.createObjectURL(blob);
    return blobUrl;
  } catch (error) {
    throw new Error(`Failed to fetch file: ${error}`);
  }
}

/**
  Sends a notification to a user who's connectionStatus is 'offline'
  @params reqBody: NewMessageNotificationDto - the request body for the notification
  @returns nothing
  @consoles error message if request fails. This step would mean that a message was sent to Sendbird, but Knock failed to
  send a notification to the recipient.
*/
export async function sendNotification(reqBody: NewMessageNotificationDto) {
  try {
    await axios.post(`${API_URL}/chat`, reqBody, await withAuthHeader());
  } catch (error) {
    // Message goes thru to sendbird, but notification fails in backend
    console.error(
      `Failed to send message notification to user ${reqBody.reqRecipientId}`
    );
  }
}
