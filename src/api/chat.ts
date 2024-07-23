import axios from 'axios';

export async function fetchFile(sendbirdUrl: string, type: string) {
  if (sendbirdUrl.includes('blob:')) return sendbirdUrl;

  const headers = {
    'Api-Token': process.env.NEXT_PUBLIC_SEND_BIRD_TOKEN,
  };

  try {
    const response = await fetch(sendbirdUrl, {
      headers,
    });
    console.log('response ', response);
    const bufferArray = await response.arrayBuffer();
    const blob = new Blob([bufferArray], { type: type });
    console.log('type ', type);
    console.log('blob', blob);
    const blobUrl = URL.createObjectURL(blob);
    console.log('blob url ', blobUrl);
    return blobUrl;
  } catch (error: any) {
    throw new Error(`Failed to fetch file: ${error.response.data.message}`);
  }
}
