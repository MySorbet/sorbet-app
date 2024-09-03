import axios from 'axios';

import { config } from '@/lib/config';
import {
  ExtendedWidgetLayout,
  GetBehanceItemType,
  GetDribbleShotType,
  GetGithubWidget,
  GetInstagramType,
  GetItemTypeBase,
  GetMediumArticleType,
  GetPhotoWidget,
  GetSoundcloudType,
  GetSpotifyType,
  GetSubstackArticleType,
  GetTwitterWidget,
  GetYouTubeVideoType,
  UpdateWidgetsBulkDto,
  WidgetSize,
  WidgetType,
} from '@/types';
import { withAuthHeader } from '@/utils';

export const getWidgetContent = async ({
  url,
  type,
}: {
  url: string;
  type: WidgetType;
}) => {
  switch (type) {
    case 'Dribbble':
      return getDribbleShot({ url });

    case 'Behance':
      return getBehanceItem({ url });

    case 'Medium':
      return getMediumArticleMetadata({ url });

    case 'Youtube':
      return getYouTubeVideoMetadata({ url });

    case 'Substack':
      return getSubstackMetadata({ url });

    case 'SpotifyAlbum':
      return getSpotifyAlbumDetails({ url });

    case 'SpotifySong':
      return getSpotifySongDetails({ url });

    case 'SoundcloudSong':
      return getSoundcloudTrackDetails({ url });

    case 'InstagramProfile':
      return getInstagramProfileMetadata({ url });

    case 'Photo':
      return getPhotoWidget({ url });

    case 'Github':
      return getGithubProfile({ url });

    case 'TwitterProfile':
      return getTwitterProfile({ url });

    case 'LinkedInProfile':
      return getLinkedInProfile({ url });

    case 'Link':
      return getLinkData({ url });
  }
};

export const getWidgetsByUsername = async (username: string) => {
  try {
    const res = await axios.get(
      `${config.sorbetApiUrl}/widgets/username/${username}`,
      withAuthHeader()
    );
    return res.data;
  } catch (error: any) {
    throw new Error(
      `Failed to get widgets for ${username}: ${error.response.data.message}`
    );
  }
};

export const getWidgetsForUser = async (userId: string) => {
  if (userId !== null) {
    try {
      const response = await axios.get(
        `${config.sorbetApiUrl}/widgets/user/${userId}`,
        withAuthHeader()
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Failed to fetch widgets for user: ${error.response.data.message}`
      );
    }
  } else {
    throw new Error('No user found');
  }
};

export const updateWidgetsBulk = async (
  widgetLayouts: UpdateWidgetsBulkDto[]
) => {
  try {
    const response = await axios.patch(
      `${config.sorbetApiUrl}/widgets/bulk-update`,
      widgetLayouts,
      withAuthHeader()
    );
    return response;
  } catch (error: any) {
    throw new Error(
      `Failed to update widgets in bulk: ${error.response.data.message}`
    );
  }
};

export const updateWidget = async (
  widgetId: string,
  widgetLayout: ExtendedWidgetLayout,
  widgetSize?: WidgetSize
) => {
  let payload: any = {
    type: widgetLayout.type,
    content: widgetLayout.content,
    layout: {
      x: widgetLayout.x,
      y: widgetLayout.y,
      w: widgetLayout.w,
      h: widgetLayout.h,
    },
  };

  if (widgetSize) {
    payload = { ...payload, size: widgetSize };
  }

  try {
    const res = await axios.patch(
      `${config.sorbetApiUrl}/widgets/${widgetId}`,
      payload,
      withAuthHeader()
    );
    return res.data;
  } catch (error: any) {
    throw new Error(`Failed to update widget: ${error.response.data.message}`);
  }
};

export const deleteWidget = async (id: string) => {
  try {
    const response = await axios.delete(
      `${config.sorbetApiUrl}/widgets/${id}`,
      withAuthHeader()
    );
    return response;
  } catch (error: any) {
    throw new Error(`Failed to delete widget: ${error.response.data.message}`);
  }
};

export const getDribbleShot = async ({ url }: GetDribbleShotType) => {
  const body: GetDribbleShotType = { url };

  try {
    const response = await axios.post(
      `${config.sorbetApiUrl}/widgets/dribbble`,
      body,
      withAuthHeader()
    );
    return response;
  } catch (error: any) {
    throw new Error(
      `Failed to get DribbbleShot: ${error.response.data.message}`
    );
  }
};

export const getBehanceItem = async ({ url }: GetBehanceItemType) => {
  const body: GetBehanceItemType = { url };

  try {
    const response = axios.post(
      `${config.sorbetApiUrl}/widgets/behance`,
      body,
      withAuthHeader()
    );
    return response;
  } catch (error: any) {
    throw new Error(
      `Failed to get Behance item: ${error.response.data.message}`
    );
  }
};

export const getMediumArticleMetadata = async ({
  url,
}: GetMediumArticleType) => {
  const body: GetMediumArticleType = { url };

  try {
    const response = await axios.post(
      `${config.sorbetApiUrl}/widgets/medium`,
      body,
      withAuthHeader()
    );
    return response;
  } catch (error: any) {
    throw new Error(
      `Failed to get Medium article metadata: ${error.response.data.message}`
    );
  }
};

export const getYouTubeVideoMetadata = async ({ url }: GetYouTubeVideoType) => {
  const body: GetYouTubeVideoType = { url };

  try {
    const response = await axios.post(
      `${config.sorbetApiUrl}/widgets/youtube`,
      body,
      withAuthHeader()
    );
    return response;
  } catch (error: any) {
    throw new Error(
      `Failed to get YouTube video metadata: ${error.response.data.message}`
    );
  }
};

export const getSubstackMetadata = async ({ url }: GetSubstackArticleType) => {
  const body: GetSubstackArticleType = { url };

  try {
    const response = await axios.post(
      `${config.sorbetApiUrl}/widgets/substack`,
      body,
      withAuthHeader()
    );
    return response;
  } catch (error: any) {
    throw new Error(
      `Failed to get Substack metadata: ${error.response.data.message}`
    );
  }
};

export const getSpotifyAlbumDetails = async ({ url }: GetSpotifyType) => {
  const body: GetSpotifyType = { url };

  try {
    const response = await axios.post(
      `${config.sorbetApiUrl}/widgets/spotify/album`,
      body,
      withAuthHeader()
    );
    return response;
  } catch (error: any) {
    throw new Error(
      `Failed to get Spotify album details: ${error.response.data.message}`
    );
  }
};

export const getSpotifySongDetails = async ({ url }: GetSpotifyType) => {
  const body: GetSpotifyType = { url };

  try {
    const response = await axios.post(
      `${config.sorbetApiUrl}/widgets/spotify/song`,
      body,
      withAuthHeader()
    );
    return response;
  } catch (error: any) {
    throw new Error(
      `Failed to get Spotify song details: ${error.response.data.message}`
    );
  }
};

export const getSoundcloudTrackDetails = async ({ url }: GetSoundcloudType) => {
  const body: GetSoundcloudType = { url };

  try {
    const response = await axios.post(
      `${config.sorbetApiUrl}/widgets/soundcloud`,
      body,
      withAuthHeader()
    );
    return response;
  } catch (error: any) {
    throw new Error(
      `Failed to get Soundcloud track details: ${error.response.data.message}`
    );
  }
};

export const getInstagramProfileMetadata = async ({
  url,
}: GetInstagramType) => {
  const body: GetInstagramType = { url };

  try {
    const response = await axios.post(
      `${config.sorbetApiUrl}/widgets/instagram`,
      body,
      withAuthHeader()
    );
    return response;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message);
    } else {
      throw new Error(`Failed to get Instagram profile metadata: ${error}`);
    }
  }
};

export const getPhotoWidget = async ({ url }: GetPhotoWidget) => {
  const body: GetPhotoWidget = { url };

  try {
    const response = await axios.post(
      `${config.sorbetApiUrl}/widgets/photo`,
      body,
      withAuthHeader()
    );
    return response;
  } catch (error: any) {
    throw new Error(
      `Failed to get photo widget: ${error.response.data.message}`
    );
  }
};

export const getGithubProfile = async ({ url }: GetGithubWidget) => {
  const body: GetGithubWidget = { url };

  try {
    const response = await axios.post(
      `${config.sorbetApiUrl}/widgets/github`,
      body,
      withAuthHeader()
    );
    return response;
  } catch (error: any) {
    throw new Error(
      `Failed to get Github profile data: ${error.response.data.message}`
    );
  }
};

export const getTwitterProfile = async ({ url }: GetTwitterWidget) => {
  const body: GetTwitterWidget = { url };

  try {
    const response = await axios.post(
      `${config.sorbetApiUrl}/widgets/twitter`,
      body,
      withAuthHeader()
    );
    return response;
  } catch (error: any) {
    throw new Error(
      `Failed to get Twitter profile data: ${error.response.data.message}`
    );
  }
};

export const getLinkedInProfile = async ({ url }: GetItemTypeBase) => {
  const body: GetItemTypeBase = { url };

  try {
    const response = await axios.post(
      `${config.sorbetApiUrl}/widgets/linkedin`,
      body,
      withAuthHeader()
    );
    return response;
  } catch (error: any) {
    throw new Error(
      `Failed to get Linkedin profile data: ${error.response.data.message}`
    );
  }
};

export const getLinkData = async ({ url }: GetItemTypeBase) => {
  const body: GetItemTypeBase = { url };

  try {
    const response = await axios.post(
      `${config.sorbetApiUrl}/widgets/link`,
      body,
      withAuthHeader()
    );
    return response;
  } catch (error: any) {
    throw new Error(
      `Failed to get generic link data: ${error.response.data.message}`
    );
  }
};
