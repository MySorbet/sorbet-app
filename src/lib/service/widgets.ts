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
import { validateToken } from '@/utils';
import axios from 'axios';

export const getWidgetContent = async ({
  url,
  type,
}: {
  url: string;
  type: WidgetType;
}) => {
  switch (type) {
    case WidgetType.Dribbble:
      return getDribbleShot({ url });

    case WidgetType.Behance:
      return getBehanceItem({ url });

    case WidgetType.Medium:
      return getMediumArticleMetadata({ url });

    case WidgetType.Youtube:
      return getYouTubeVideoMetadata({ url });

    case WidgetType.Substack:
      return getSubstackMetadata({ url });

    case WidgetType.SpotifyAlbum:
      return getSpotifyAlbumDetails({ url });

    case WidgetType.SpotifySong:
      return getSpotifySongDetails({ url });

    case WidgetType.SoundcloudSong:
      return getSoundcloudTrackDetails({ url });

    case WidgetType.InstagramProfile:
      return getInstagramProfileMetadata({ url });

    case WidgetType.Photo:
      return getPhotoWidget({ url });

    case WidgetType.Github:
      return getGithubProfile({ url });

    case WidgetType.TwitterProfile:
      return getTwitterProfile({ url });

    case WidgetType.LinkedInProfile:
      return getLinkedInProfile({ url });

    case WidgetType.Link:
      return getLinkData({ url });
  }
};

export const getWidgetsByUsername = async (username: string) => {
  const reqHeader = validateToken({}, true);

  try {
    const res = await axios.get(
      `${config.sorbetApiUrl}/widgets/username/${username}`,
      reqHeader
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
    const reqHeader = validateToken({}, true);

    try {
      const response = await axios.get(
        `${config.sorbetApiUrl}/widgets/user/${userId}`,
        reqHeader
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
  const reqHeader = validateToken({}, true);
  try {
    const response = await axios.patch(
      `${config.sorbetApiUrl}/widgets/bulk-update`,
      widgetLayouts,
      reqHeader
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
  widgetSize?: number
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
    const widgetSizeAsString = WidgetSize[widgetSize];
    payload = { ...payload, size: widgetSizeAsString };
  }

  const reqHeader = validateToken({}, true);

  try {
    const res = await axios.patch(
      `${config.sorbetApiUrl}/widgets/${widgetId}`,
      payload,
      reqHeader
    );
    return res.data;
  } catch (error: any) {
    throw new Error(`Failed to update widget: ${error.response.data.message}`);
  }
};

export const deleteWidget = async (id: string) => {
  const reqHeader = validateToken({}, true);

  try {
    const response = await axios.delete(
      `${config.sorbetApiUrl}/widgets/${id}`,
      reqHeader
    );
    return response;
  } catch (error: any) {
    throw new Error(`Failed to delete widget: ${error.response.data.message}`);
  }
};

export const getDribbleShot = async ({ url }: GetDribbleShotType) => {
  const body: GetDribbleShotType = { url };
  const reqHeader = validateToken({}, true);

  try {
    const response = await axios.post(
      `${config.sorbetApiUrl}/widgets/dribbble`,
      body,
      reqHeader
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
  const reqHeader = validateToken({}, true);

  try {
    const response = axios.post(
      `${config.sorbetApiUrl}/widgets/behance`,
      body,
      reqHeader
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
  const reqHeader = validateToken({}, true);

  try {
    const response = await axios.post(
      `${config.sorbetApiUrl}/widgets/medium`,
      body,
      reqHeader
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
  const reqHeader = validateToken({}, true);

  try {
    const response = await axios.post(
      `${config.sorbetApiUrl}/widgets/youtube`,
      body,
      reqHeader
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
  const reqHeader = validateToken({}, true);

  try {
    const response = await axios.post(
      `${config.sorbetApiUrl}/widgets/substack`,
      body,
      reqHeader
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
  const reqHeader = validateToken({}, true);

  try {
    const response = await axios.post(
      `${config.sorbetApiUrl}/widgets/spotify/album`,
      body,
      reqHeader
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
  const reqHeader = validateToken({}, true);

  try {
    const response = await axios.post(
      `${config.sorbetApiUrl}/widgets/spotify/song`,
      body,
      reqHeader
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
  const reqHeader = validateToken({}, true);

  try {
    const response = await axios.post(
      `${config.sorbetApiUrl}/widgets/soundcloud`,
      body,
      reqHeader
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
  const reqHeader = validateToken({}, true);

  try {
    const response = await axios.post(
      `${config.sorbetApiUrl}/widgets/instagram`,
      body,
      reqHeader
    );
    return response;
  } catch (error: any) {
    throw new Error(
      `Failed to get Instagram profile metadata: ${error.response.data.message}`
    );
  }
};

export const getPhotoWidget = async ({ url }: GetPhotoWidget) => {
  const body: GetPhotoWidget = { url };
  const reqHeader = validateToken({}, true);

  try {
    const response = await axios.post(
      `${config.sorbetApiUrl}/widgets/photo`,
      body,
      reqHeader
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
  const reqHeader = validateToken({}, true);

  try {
    const response = await axios.post(
      `${config.sorbetApiUrl}/widgets/github`,
      body,
      reqHeader
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
  const reqHeader = validateToken({}, true);

  try {
    const response = await axios.post(
      `${config.sorbetApiUrl}/widgets/twitter`,
      body,
      reqHeader
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
  const reqHeader = validateToken({}, true);

  try {
    const response = await axios.post(
      `${config.sorbetApiUrl}/widgets/linkedin`,
      body,
      reqHeader
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
  const reqHeader = validateToken({}, true);

  try {
    const response = await axios.post(
      `${config.sorbetApiUrl}/widgets/link`,
      body,
      reqHeader
    );
    return response;
  } catch (error: any) {
    throw new Error(
      `Failed to get generic link data: ${error.response.data.message}`
    );
  }
};
