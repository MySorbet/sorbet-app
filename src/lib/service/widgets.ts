import { config } from '@/lib/config';
import {
  ExtendedWidgetLayout,
  GetBehanceItemType,
  GetDribbleShotType,
  GetGithubWidget,
  GetInstagramType,
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
import { runApi, validateToken } from '@/utils';
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

    case WidgetType.Twitter:
      return getTwitterProfile({ url });
  }
};

export const getWidgetsByUsername = async (username: string) => {
  const response = await runApi(
    'GET',
    `${config.devApiUrl}/widgets/username/${username}`,
    {},
    {},
    true
  );
  if (response.statusCode >= 200 && response.statusCode < 300) {
    return response.data;
  } else {
    throw new Error(`Error ${response.status}: ${response.message}`);
  }
};

export const getWidgetsForUser = async (userId: string) => {
  if (userId !== null) {
    const apiReqHeaders = validateToken({}, true);

    try {
      const response = await axios.get(
        `${config.devApiUrl}/widgets/user/${userId}`,
        apiReqHeaders
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response.data.message);
    }
  } else {
    throw new Error('No user found');
  }
};

export const updateWidgetsBulk = async (
  widgetLayouts: UpdateWidgetsBulkDto[]
) => {
  const apiReqHeaders = validateToken({}, true);

  try {
    const response = await axios.patch(
      `${config.devApiUrl}/widgets/bulk-update`,
      widgetLayouts,
      apiReqHeaders
    );
    return response;
  } catch (error: any) {
    throw new Error(error.response.data.message);
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

  const response = await runApi(
    'PATCH',
    `${config.devApiUrl}/widgets/${widgetId}`,
    payload,
    {},
    true
  );

  if (response.statusCode >= 200 && response.statusCode < 300) {
    return response.data;
  } else {
    throw new Error(`Error ${response.status}: ${response.message}`);
  }
};

export const deleteWidget = async (id: string) => {
  const apiReqHeaders = validateToken({}, true);

  try {
    const response = await axios.delete(
      `${config.devApiUrl}/widgets/${id}`,
      apiReqHeaders
    );
    return response;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const getDribbleShot = async ({ url }: GetDribbleShotType) => {
  const body: GetDribbleShotType = { url };
  const apiReqHeaders = validateToken({}, true);

  try {
    const response = await axios.post(
      `${config.devApiUrl}/widgets/dribbble`,
      body,
      apiReqHeaders
    );
    return response;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const getBehanceItem = async ({ url }: GetBehanceItemType) => {
  const body: GetBehanceItemType = { url };
  const apiReqHeaders = validateToken({}, true);

  try {
    const response = axios.post(
      `${config.devApiUrl}/widgets/behance`,
      body,
      apiReqHeaders
    );
    return response;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const getMediumArticleMetadata = async ({
  url,
}: GetMediumArticleType) => {
  const body: GetMediumArticleType = { url };
  const apiReqHeaders = validateToken({}, true);

  try {
    const response = await axios.post(
      `${config.devApiUrl}/widgets/medium`,
      body,
      apiReqHeaders
    );
    return response;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const getYouTubeVideoMetadata = async ({ url }: GetYouTubeVideoType) => {
  const body: GetYouTubeVideoType = { url };
  const apiReqHeaders = validateToken({}, true);

  try {
    const response = await axios.post(
      `${config.devApiUrl}/widgets/youtube`,
      body,
      apiReqHeaders
    );
    return response;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const getSubstackMetadata = async ({ url }: GetSubstackArticleType) => {
  const body: GetSubstackArticleType = { url };
  const apiReqHeaders = validateToken({}, true);

  try {
    const response = await axios.post(
      `${config.devApiUrl}/widgets/substack`,
      body,
      apiReqHeaders
    );
    return response;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const getSpotifyAlbumDetails = async ({ url }: GetSpotifyType) => {
  const body: GetSpotifyType = { url };
  const apiReqHeaders = validateToken({}, true);

  try {
    const response = await axios.post(
      `${config.devApiUrl}/widgets/spotify/album`,
      body,
      apiReqHeaders
    );
    return response;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const getSpotifySongDetails = async ({ url }: GetSpotifyType) => {
  const body: GetSpotifyType = { url };
  const apiReqHeaders = validateToken({}, true);

  try {
    const response = await axios.post(
      `${config.devApiUrl}/widgets/spotify/song`,
      body,
      apiReqHeaders
    );
    return response;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const getSoundcloudTrackDetails = async ({ url }: GetSoundcloudType) => {
  const body: GetSoundcloudType = { url };
  const apiReqHeaders = validateToken({}, true);

  try {
    const response = await axios.post(
      `${config.devApiUrl}/widgets/soundcloud`,
      body,
      apiReqHeaders
    );
    return response;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const getInstagramProfileMetadata = async ({
  url,
}: GetInstagramType) => {
  const body: GetInstagramType = { url };
  const apiReqHeaders = validateToken({}, true);

  try {
    const response = await axios.post(
      `${config.devApiUrl}/widgets/instagram`,
      body,
      apiReqHeaders
    );
    return response;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const getPhotoWidget = async ({ url }: GetPhotoWidget) => {
  const body: GetPhotoWidget = { url };
  const apiReqHeaders = validateToken({}, true);

  try {
    const response = await axios.post(
      `${config.devApiUrl}/widgets/photo`,
      body,
      apiReqHeaders
    );
    return response;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const getGithubProfile = async ({ url }: GetGithubWidget) => {
  const body: GetGithubWidget = { url };
  const apiReqHeaders = validateToken({}, true);

  try {
    const response = await axios.post(
      `${config.devApiUrl}/widgets/github`,
      body,
      apiReqHeaders
    );
    return response;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const getTwitterProfile = async ({ url }: GetTwitterWidget) => {
  const body: GetTwitterWidget = { url };
  const apiReqHeaders = validateToken({}, true);

  try {
    const response = await axios.post(
      `${config.devApiUrl}/widgets/twitter`,
      body,
      apiReqHeaders
    );
    return response;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};
