import { NewMessageNotificationDto } from '@/types/sendbird';
import { API_URL, validateToken } from '@/utils';
import axios from 'axios';
import * as blobUtil from 'blob-util';

export async function fetchFile(sendbirdUrl: string, type: string) {
  if (sendbirdUrl.includes('blob:')) {
    return sendbirdUrl;
  }
  const reqBody = { url: sendbirdUrl };
  const reqHeaders = validateToken({}, true);

  try {
    const response = await axios.post(
      `${API_URL}/images/sendbird`,
      reqBody,
      reqHeaders
    );
    const binary = response.data.binString;
    const buffer = blobUtil.binaryStringToArrayBuffer(binary);
    const blob = new Blob([buffer], { type: type });
    const blobUrl = URL.createObjectURL(blob);
    return blobUrl;
  } catch (error: any) {
    throw new Error(`Failed to fetch file: ${error}`);
  }
}

export async function sendNotification(reqBody: NewMessageNotificationDto) {
  const reqHeaders = validateToken({}, true);

  try {
    await axios.post(`${API_URL}/chat`, reqBody, reqHeaders);
  } catch (error: any) {
    // Message goes thru to sendbird, but notification fails in backend
    console.error(
      `Failed to send message notification to user ${reqBody.reqRecipientId}`
    );
  }
}
