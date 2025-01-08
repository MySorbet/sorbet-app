import axios, { AxiosResponse } from 'axios';

import { env } from '@/lib/env';
import {
  GetWidgetBody,
  UpdateWidgetsBulkDto,
  WidgetContentType,
  WidgetDto,
  WidgetLayoutItem,
  WidgetSize,
  WidgetType,
} from '@/types';

import { withAuthHeader } from './withAuthHeader';

/** Toggle the appropriate error message based on if it was an Axios issue */
const catchAndRethrowWidgetError = (error: unknown, message: string) => {
  if (axios.isAxiosError(error)) {
    throw new Error(`Axios error, ${message}: ${error.response?.data.message}`);
  } else {
    throw new Error(`Non-axios error, ${message}L ${error}`);
  }
};

export const getWidgetsByHandle = async (handle: string) => {
  try {
    const res = await axios.get(
      `${env.NEXT_PUBLIC_SORBET_API_URL}/widgets/handle/${handle}`,
      await withAuthHeader()
    );
    return res.data;
  } catch (error) {
    catchAndRethrowWidgetError(error, `Failed to get widgets for ${handle}`);
  }
};

export const getWidgetsForUser = async (userId: string) => {
  if (userId !== null) {
    try {
      const response = await axios.get(
        `${env.NEXT_PUBLIC_SORBET_API_URL}/widgets/user/${userId}`,
        await withAuthHeader()
      );
      return response.data;
    } catch (error) {
      catchAndRethrowWidgetError(
        error,
        `Failed to fetch widgets for user ${userId}`
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
      `${env.NEXT_PUBLIC_SORBET_API_URL}/widgets/bulk-update`,
      widgetLayouts,
      await withAuthHeader()
    );
    return response;
  } catch (error) {
    catchAndRethrowWidgetError(error, `Failed to update widgets in bulk`);
  }
};

export const updateWidget = async (
  widgetId: string,
  widgetLayoutItem: WidgetLayoutItem,
  widgetSize?: WidgetSize
) => {
  let payload: Partial<WidgetDto> = {
    type: widgetLayoutItem.type,
    content: widgetLayoutItem.content,
    layout: {
      x: widgetLayoutItem.x,
      y: widgetLayoutItem.y,
      w: widgetLayoutItem.w,
      h: widgetLayoutItem.h,
    },
  };

  if (widgetSize) {
    payload = { ...payload, size: widgetSize };
  }

  try {
    const res = await axios.patch(
      `${env.NEXT_PUBLIC_SORBET_API_URL}/widgets/${widgetId}`,
      payload,
      await withAuthHeader()
    );
    return res.data;
  } catch (error) {
    catchAndRethrowWidgetError(
      error,
      `Failed to update widget with ID ${widgetId}`
    );
  }
};

export const restoreWidgetImage = async (
  widgetId: string,
  type: WidgetType,
  redirectUrl: string
): Promise<string | undefined> => {
  try {
    const payload: Partial<WidgetDto> = {
      id: widgetId,
      type: type,
      redirectUrl: redirectUrl,
    };
    const response = await axios.post(
      `${env.NEXT_PUBLIC_SORBET_API_URL}/widgets/restore-image`,
      payload,
      await withAuthHeader()
    );
    return response.data;
  } catch (error) {
    catchAndRethrowWidgetError(error, `Failed to update widgets in bulk`);
  }
};

export const restoreInstagramWidget = async (
  widgetId: string,
  redirectUrl: string
): Promise<{ message: string; description: string } | undefined> => {
  try {
    const payload: Partial<WidgetDto> = {
      id: widgetId,
      redirectUrl: redirectUrl,
    };
    const response = await axios.post(
      `${env.NEXT_PUBLIC_SORBET_API_URL}/widgets/restore-instagram-widget`,
      payload,
      await withAuthHeader()
    );
    return response.data;
  } catch (error) {
    catchAndRethrowWidgetError(error, `Failed to update widgets in bulk`);
  }
};

/** Updating the links of image widgets (only widget's redirectUrl should be updated) */
export const updateWidgetLink = async (key: string, url: string) => {
  // redirectUrl should be set to what we want already in the payload
  const payload: { redirectUrl: string | undefined } = {
    redirectUrl: url,
  };

  try {
    const res = await axios.patch(
      `${env.NEXT_PUBLIC_SORBET_API_URL}/widgets/${key}`,
      payload,
      await withAuthHeader()
    );
    return res.data;
  } catch (error) {
    catchAndRethrowWidgetError(
      error,
      `Failed to update widget link with ID ${key}`
    );
  }
};

/** Updating the content of widgets */
export const updateWidgetContent = async (
  key: string,
  content: WidgetContentType
) => {
  // content should be set to what we want already in the payload
  const payload: { content: WidgetContentType } = {
    content: content,
  };

  try {
    const response = await axios.patch(
      `${env.NEXT_PUBLIC_SORBET_API_URL}/widgets/${key}`,
      payload,
      await withAuthHeader()
    );
    return response;
  } catch (error) {
    catchAndRethrowWidgetError(
      error,
      `Failed to update widget image with ID ${key}`
    );
  }
};

export const deleteWidget = async (id: string) => {
  try {
    const response = await axios.delete(
      `${env.NEXT_PUBLIC_SORBET_API_URL}/widgets/${id}`,
      await withAuthHeader()
    );
    return response;
  } catch (error) {
    catchAndRethrowWidgetError(error, `Failed to delete widget with ID ${id}`);
  }
};

// 👇 Local Widget Getters 👇

// to appease TypeScript, in the catch statements catchAndRethrowWidgetError()
// is returned to change the return type from
// undefined to Promise<AxiosResponse<WidgetDto, unknown>>

const getDribbleShot: WidgetGetterFn = async (body) => {
  try {
    const response = await axios.post<WidgetDto>(
      `${env.NEXT_PUBLIC_SORBET_API_URL}/widgets/dribbble`,
      body,
      await withAuthHeader()
    );
    return response;
  } catch (error) {
    return catchAndRethrowWidgetError(error, `Failed to get DribbleShot`);
  }
};

const getBehanceItem: WidgetGetterFn = async (body) => {
  try {
    const response = axios.post<WidgetDto>(
      `${env.NEXT_PUBLIC_SORBET_API_URL}/widgets/behance`,
      body,
      await withAuthHeader()
    );
    return response;
  } catch (error) {
    return catchAndRethrowWidgetError(error, `Failed to get Behance Item`);
  }
};

const getMediumArticleMetadata: WidgetGetterFn = async (body) => {
  try {
    const response = await axios.post<WidgetDto>(
      `${env.NEXT_PUBLIC_SORBET_API_URL}/widgets/medium`,
      body,
      await withAuthHeader()
    );
    return response;
  } catch (error) {
    return catchAndRethrowWidgetError(
      error,
      `Failed to get Medium article metadata`
    );
  }
};

const getYouTubeVideoMetadata: WidgetGetterFn = async (body) => {
  try {
    const response = await axios.post<WidgetDto>(
      `${env.NEXT_PUBLIC_SORBET_API_URL}/widgets/youtube`,
      body,
      await withAuthHeader()
    );
    return response;
  } catch (error) {
    return catchAndRethrowWidgetError(error, `Failed to get Youtube metadata`);
  }
};

const getSubstackMetadata: WidgetGetterFn = async (body) => {
  try {
    const response = await axios.post<WidgetDto>(
      `${env.NEXT_PUBLIC_SORBET_API_URL}/widgets/substack`,
      body,
      await withAuthHeader()
    );
    return response;
  } catch (error) {
    return catchAndRethrowWidgetError(error, `Failed to get Substack metadata`);
  }
};

const getSpotifyAlbumDetails: WidgetGetterFn = async (body) => {
  try {
    const response = await axios.post<WidgetDto>(
      `${env.NEXT_PUBLIC_SORBET_API_URL}/widgets/spotify/album`,
      body,
      await withAuthHeader()
    );
    return response;
  } catch (error) {
    return catchAndRethrowWidgetError(
      error,
      `Failed to get Spotify album details`
    );
  }
};

const getSpotifySongDetails: WidgetGetterFn = async (body) => {
  try {
    const response = await axios.post<WidgetDto>(
      `${env.NEXT_PUBLIC_SORBET_API_URL}/widgets/spotify/song`,
      body,
      await withAuthHeader()
    );
    return response;
  } catch (error) {
    return catchAndRethrowWidgetError(
      error,
      `Failed to get Spotify song details`
    );
  }
};

const getSoundcloudTrackDetails: WidgetGetterFn = async (body) => {
  try {
    const response = await axios.post<WidgetDto>(
      `${env.NEXT_PUBLIC_SORBET_API_URL}/widgets/soundcloud`,
      body,
      await withAuthHeader()
    );
    return response;
  } catch (error) {
    return catchAndRethrowWidgetError(
      error,
      `Failed to get Soundcloud track details`
    );
  }
};

const getInstagramProfileMetadata: WidgetGetterFn = async (body) => {
  try {
    const response = await axios.post<WidgetDto>(
      `${env.NEXT_PUBLIC_SORBET_API_URL}/widgets/instagram`,
      body,
      await withAuthHeader()
    );
    return response;
  } catch (error) {
    return catchAndRethrowWidgetError(
      error,
      `Failed to get Instagram profile metadata`
    );
  }
};

const getPhotoWidget: WidgetGetterFn = async (body) => {
  try {
    const response = await axios.post<WidgetDto>(
      `${env.NEXT_PUBLIC_SORBET_API_URL}/widgets/photo`,
      body,
      await withAuthHeader()
    );
    return response;
  } catch (error) {
    return catchAndRethrowWidgetError(error, `Failed to get photo widget`);
  }
};

const getGithubProfile: WidgetGetterFn = async (body) => {
  try {
    const response = await axios.post<WidgetDto>(
      `${env.NEXT_PUBLIC_SORBET_API_URL}/widgets/github`,
      body,
      await withAuthHeader()
    );
    return response;
  } catch (error) {
    return catchAndRethrowWidgetError(
      error,
      `Failed to get Github profile data`
    );
  }
};

const getTwitterProfile: WidgetGetterFn = async (body) => {
  try {
    const response = await axios.post<WidgetDto>(
      `${env.NEXT_PUBLIC_SORBET_API_URL}/widgets/twitter`,
      body,
      await withAuthHeader()
    );
    return response;
  } catch (error) {
    return catchAndRethrowWidgetError(
      error,
      `Failed to get Twitter profile data`
    );
  }
};

const getLinkedInProfile: WidgetGetterFn = async (body) => {
  try {
    const response = await axios.post<WidgetDto>(
      `${env.NEXT_PUBLIC_SORBET_API_URL}/widgets/linkedin`,
      body,
      await withAuthHeader()
    );
    return response;
  } catch (error) {
    return catchAndRethrowWidgetError(
      error,
      `Failed to get LinkedIn profile data`
    );
  }
};

const getLinkData: WidgetGetterFn = async (body) => {
  try {
    const response = await axios.post<WidgetDto>(
      `${env.NEXT_PUBLIC_SORBET_API_URL}/widgets/link`,
      body,
      await withAuthHeader()
    );
    return response;
  } catch (error) {
    return catchAndRethrowWidgetError(error, `Failed to get generic link data`);
  }
};

const getSectionTitleData: WidgetGetterFn = async (body) => {
  try {
    const response = await axios.post<WidgetDto>(
      `${env.NEXT_PUBLIC_SORBET_API_URL}/widgets/section-title`,
      body,
      await withAuthHeader()
    );
    return response;
  } catch (error) {
    return catchAndRethrowWidgetError(
      error,
      `Failed to get section title data`
    );
  }
};

/** Map the supported widget types to their corresponding getter functions */
const widgetGetters: Record<SupportedWidgetTypes, WidgetGetterFn> = {
  Photo: getPhotoWidget,
  Substack: getSubstackMetadata,
  SpotifySong: getSpotifySongDetails,
  SpotifyAlbum: getSpotifyAlbumDetails,
  SoundcloudSong: getSoundcloudTrackDetails,
  InstagramProfile: getInstagramProfileMetadata,
  TwitterProfile: getTwitterProfile,
  LinkedInProfile: getLinkedInProfile,
  Youtube: getYouTubeVideoMetadata,
  Github: getGithubProfile,
  Dribbble: getDribbleShot,
  Behance: getBehanceItem,
  Medium: getMediumArticleMetadata,
  Link: getLinkData,
  SectionTitle: getSectionTitleData,
};

/** Get/create a widget with the given url and type */
export const createWidget = async ({ url, type }: CreateWidgetParams) => {
  return widgetGetters[type]({ url });
};

// 👇 Types 👇

export type CreateWidgetParams = {
  /** The url to get the widget content for */
  url: string;
  /** The type of the widget to get */
  type: SupportedWidgetTypes;
};

type WidgetGetterFn = (
  body: GetWidgetBody
) => Promise<AxiosResponse<WidgetDto, unknown>>;

/** Currently, Figma and InstagramPost are not supported */
export type SupportedWidgetTypes = Exclude<
  WidgetType,
  'Figma' | 'InstagramPost'
>;
