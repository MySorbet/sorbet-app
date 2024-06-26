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
import { runApi } from '@/utils';

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
