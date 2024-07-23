'use server';

export async function fetchFile(sendbirdUrl: string, type: string) {
  if (sendbirdUrl.includes('blob:')) return sendbirdUrl;

  const headers = {
    'Api-Token': process.env.SEND_BIRD_TOKEN || '',
  };

  try {
    const response = await fetch(sendbirdUrl, {
      headers,
    });
    const bufferArray = await response.arrayBuffer();
    const blob = new Blob([bufferArray], { type: type });
    const blobUrl = URL.createObjectURL(blob);
    return blobUrl;
  } catch (error: any) {
    throw new Error(`Failed to fetch file: ${error.response.data.message}`);
  }
}
