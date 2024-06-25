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
  if (userId != null) {
    const response = await runApi(
      'GET',
      `${config.devApiUrl}/widgets/user/${userId}`,
      {},
      {},
      true
    );
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return response.data;
    } else {
      throw new Error(`Error ${response?.status}: ${response.data?.message}`);
    }
  }
};

export const updateWidgetsBulk = async (
  widgetLayouts: UpdateWidgetsBulkDto[]
) => {
  const response = await runApi(
    'PATCH',
    `${config.devApiUrl}/widgets/bulk-update`,
    widgetLayouts,
    {},
    true
  );
  if (response.statusCode >= 200 && response.statusCode < 300) {
    return response.data;
  } else {
    throw new Error(`Error ${response.status}: ${response.message}`);
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
  const response = await runApi(
    'DELETE',
    `${config.devApiUrl}/widgets/${id}`,
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

export const deleteWidget2 = async (id: string) => {
  const apiReqHeaders = validateToken({}, true);

  try {
    const response = await axios.delete(
      `${config.devApiUrl}/widgets/${id}`,
      apiReqHeaders
    );
    return response;
  } catch (error: any) {
    throw new Error(`Error ${error.status}: ${error.message}`);
  }
};

export const getDribbleShot = async ({ url }: GetDribbleShotType) => {
  const body: GetDribbleShotType = { url };
  const response = await runApi(
    'POST',
    `${config.devApiUrl}/widgets/dribbble`,
    body,
    {},
    true
  );
  if (response.statusCode >= 200 && response.statusCode < 300) {
    return response.data;
  } else {
    throw new Error(`Error ${response.status}: ${response.message}`);
  }
};

export const getDribbleShot2 = async ({ url }: GetDribbleShotType) => {
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
    throw new Error(error.message);
  }
};

export const getBehanceItem = async ({ url }: GetBehanceItemType) => {
  const body: GetBehanceItemType = { url };
  const response = await runApi(
    'POST',
    `${config.devApiUrl}/widgets/behance`,
    body,
    {},
    true
  );
  if (response.statusCode >= 200 && response.statusCode < 300) {
    return response.data;
  } else {
    throw new Error(`Error ${response.status}: ${response.message}`);
  }
};

export const getBehanceItem2 = async ({ url }: GetBehanceItemType) => {
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
    throw new Error(error.message);
  }
};

export const getMediumArticleMetadata = async ({
  url,
}: GetMediumArticleType) => {
  const body: GetMediumArticleType = { url };
  const response = await runApi(
    'POST',
    `${config.devApiUrl}/widgets/medium`,
    body,
    {},
    true
  );
  if (response.statusCode >= 200 && response.statusCode < 300) {
    return response.data;
  } else {
    throw new Error(`Error ${response.status}: ${response.message}`);
  }
};

export const getMediumArticleMetadata2 = async ({
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
    throw new Error(error.message);
  }
};

export const getYouTubeVideoMetadata = async ({ url }: GetYouTubeVideoType) => {
  const body: GetYouTubeVideoType = { url };
  const response = await runApi(
    'POST',
    `${config.devApiUrl}/widgets/youtube`,
    body,
    {},
    true
  );
  if (response.statusCode >= 200 && response.statusCode < 300) {
    return response.data;
  } else {
    throw new Error(`Error ${response.status}: ${response.message}`);
  }
};

export const getYouTubeVideoMetadata2 = async ({
  url,
}: GetYouTubeVideoType) => {
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
    throw new Error(error.message);
  }
};

export const getSubstackMetadata = async ({ url }: GetSubstackArticleType) => {
  const body: GetSubstackArticleType = { url };
  const response = await runApi(
    'POST',
    `${config.devApiUrl}/widgets/substack`,
    body,
    {},
    true
  );
  if (response.statusCode >= 200 && response.statusCode < 300) {
    return response.data;
  } else {
    throw new Error(`Error ${response.status}: ${response.message}`);
  }
};

export const getSubstackMetadata2 = async ({ url }: GetSubstackArticleType) => {
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
    throw new Error(error.message);
  }
};

export const getSpotifyAlbumDetails = async ({ url }: GetSpotifyType) => {
  const body: GetSpotifyType = { url };
  const response = await runApi(
    'POST',
    `${config.devApiUrl}/widgets/spotify/album`,
    body,
    {},
    true
  );
  if (response.statusCode >= 200 && response.statusCode < 300) {
    return response.data;
  } else {
    throw new Error(`Error ${response.status}: ${response.message}`);
  }
};

export const getSpotifyAlbumDetails2 = async ({ url }: GetSpotifyType) => {
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
    throw new Error(error.message);
  }
};

export const getSpotifySongDetails = async ({ url }: GetSpotifyType) => {
  const body: GetSpotifyType = { url };
  const response = await runApi(
    'POST',
    `${config.devApiUrl}/widgets/spotify/song`,
    body,
    {},
    true
  );
  if (response.statusCode >= 200 && response.statusCode < 300) {
    return response.data;
  } else {
    throw new Error(`Error ${response.status}: ${response.message}`);
  }
};

export const getSpotifySongDetails2 = async ({ url }: GetSpotifyType) => {
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
    throw new Error(error.message);
  }
};

export const getSoundcloudTrackDetails = async ({ url }: GetSoundcloudType) => {
  const body: GetSoundcloudType = { url };
  const response = await runApi(
    'POST',
    `${config.devApiUrl}/widgets/soundcloud`,
    body,
    {},
    true
  );
  if (response.statusCode >= 200 && response.statusCode < 300) {
    return response.data;
  } else {
    throw new Error(`Error ${response.status}: ${response.message}`);
  }
};

export const getSoundcloudTrackDetails2 = async ({
  url,
}: GetSoundcloudType) => {
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
    throw new Error(error.message);
  }
};

export const getInstagramProfileMetadata = async ({
  url,
}: GetInstagramType) => {
  const body: GetInstagramType = { url };
  const response = await runApi(
    'POST',
    `${config.devApiUrl}/widgets/instagram`,
    body,
    {},
    true
  );
  if (response.statusCode >= 200 && response.statusCode < 300) {
    return response.data;
  } else {
    throw new Error(`Error ${response.status}: ${response.message}`);
  }
};

export const getInstagramProfileMetadata2 = async ({
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
    throw new Error(error.message);
  }
};

export const getPhotoWidget = async ({ url }: GetPhotoWidget) => {
  const body: GetPhotoWidget = { url };
  const response = await runApi(
    'POST',
    `${config.devApiUrl}/widgets/photo`,
    body,
    {},
    true
  );
  if (response.statusCode >= 200 && response.statusCode < 300) {
    return response.data;
  } else {
    throw new Error(`Error ${response.status}: ${response.message}`);
  }
};

export const getPhotoWidget2 = async ({ url }: GetPhotoWidget) => {
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
    throw new Error(error.message);
  }
};

export const getGithubProfile = async ({ url }: GetGithubWidget) => {
  const body: GetGithubWidget = { url };
  const response = await runApi(
    'POST',
    `${config.devApiUrl}/widgets/github`,
    body,
    {},
    true
  );
  if (response.statusCode >= 200 && response.statusCode < 300) {
    return response.data;
  } else {
    throw new Error(`Error ${response.status}: ${response.message}`);
  }
};

export const getGithubProfile2 = async ({ url }: GetGithubWidget) => {
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
    throw new Error(error.message);
  }
};

export const getTwitterProfile = async ({ url }: GetTwitterWidget) => {
  const body: GetTwitterWidget = { url };
  const response = await runApi(
    'POST',
    `${config.devApiUrl}/widgets/twitter`,
    body,
    {},
    true
  );
  if (response.statusCode >= 200 && response.statusCode < 300) {
    return response.data;
  } else {
    throw new Error(`Error ${response.status}: ${response.message}`);
  }
};

export const getTwitterProfile2 = async ({ url }: GetTwitterWidget) => {
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
    throw new Error(error.message);
  }
};
