import axios, { AxiosResponse } from 'axios';

import { env } from '@/lib/env';
import {
  GetWidgetBody,
  UpdateWidgetsBulkDto,
  WidgetDto,
  WidgetLayoutItem,
  WidgetSize,
  WidgetType,
} from '@/types';
import { withAuthHeader } from '@/utils';

export const getWidgetsByUsername = async (username: string) => {
  try {
    const res = await axios.get(
      `${env.NEXT_PUBLIC_SORBET_API_URL}/widgets/username/${username}`,
      await withAuthHeader()
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
        `${env.NEXT_PUBLIC_SORBET_API_URL}/widgets/user/${userId}`,
        await withAuthHeader()
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
      `${env.NEXT_PUBLIC_SORBET_API_URL}/widgets/bulk-update`,
      widgetLayouts,
      await withAuthHeader()
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
  widgetLayoutItem: WidgetLayoutItem,
  widgetSize?: WidgetSize
) => {
  let payload: any = {
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
  } catch (error: any) {
    throw new Error(`Failed to update widget: ${error.response.data.message}`);
  }
};

export const deleteWidget = async (id: string) => {
  try {
    const response = await axios.delete(
      `${env.NEXT_PUBLIC_SORBET_API_URL}/widgets/${id}`,
      await withAuthHeader()
    );
    return response;
  } catch (error: any) {
    throw new Error(`Failed to delete widget: ${error.response.data.message}`);
  }
};

export const getDribbleShot: WidgetGetterFn = async (body) => {
  try {
    const response = await axios.post<WidgetDto>(
      `${env.NEXT_PUBLIC_SORBET_API_URL}/widgets/dribbble`,
      body,
      await withAuthHeader()
    );
    return response;
  } catch (error: any) {
    throw new Error(
      `Failed to get DribbbleShot: ${error.response.data.message}`
    );
  }
};

export const getBehanceItem: WidgetGetterFn = async (body) => {
  try {
    const response = axios.post<WidgetDto>(
      `${env.NEXT_PUBLIC_SORBET_API_URL}/widgets/behance`,
      body,
      await withAuthHeader()
    );
    return response;
  } catch (error: any) {
    throw new Error(
      `Failed to get Behance item: ${error.response.data.message}`
    );
  }
};

export const getMediumArticleMetadata: WidgetGetterFn = async (body) => {
  try {
    const response = await axios.post<WidgetDto>(
      `${env.NEXT_PUBLIC_SORBET_API_URL}/widgets/medium`,
      body,
      await withAuthHeader()
    );
    return response;
  } catch (error: any) {
    throw new Error(
      `Failed to get Medium article metadata: ${error.response.data.message}`
    );
  }
};

export const getYouTubeVideoMetadata: WidgetGetterFn = async (body) => {
  try {
    const response = await axios.post<WidgetDto>(
      `${env.NEXT_PUBLIC_SORBET_API_URL}/widgets/youtube`,
      body,
      await withAuthHeader()
    );
    return response;
  } catch (error: any) {
    throw new Error(
      `Failed to get YouTube video metadata: ${error.response.data.message}`
    );
  }
};

export const getSubstackMetadata: WidgetGetterFn = async (body) => {
  try {
    const response = await axios.post<WidgetDto>(
      `${env.NEXT_PUBLIC_SORBET_API_URL}/widgets/substack`,
      body,
      await withAuthHeader()
    );
    return response;
  } catch (error: any) {
    throw new Error(
      `Failed to get Substack metadata: ${error.response.data.message}`
    );
  }
};

export const getSpotifyAlbumDetails: WidgetGetterFn = async (body) => {
  try {
    const response = await axios.post<WidgetDto>(
      `${env.NEXT_PUBLIC_SORBET_API_URL}/widgets/spotify/album`,
      body,
      await withAuthHeader()
    );
    return response;
  } catch (error: any) {
    throw new Error(
      `Failed to get Spotify album details: ${error.response.data.message}`
    );
  }
};

export const getSpotifySongDetails: WidgetGetterFn = async (body) => {
  try {
    const response = await axios.post<WidgetDto>(
      `${env.NEXT_PUBLIC_SORBET_API_URL}/widgets/spotify/song`,
      body,
      await withAuthHeader()
    );
    return response;
  } catch (error: any) {
    throw new Error(
      `Failed to get Spotify song details: ${error.response.data.message}`
    );
  }
};

export const getSoundcloudTrackDetails: WidgetGetterFn = async (body) => {
  try {
    const response = await axios.post<WidgetDto>(
      `${env.NEXT_PUBLIC_SORBET_API_URL}/widgets/soundcloud`,
      body,
      await withAuthHeader()
    );
    return response;
  } catch (error: any) {
    throw new Error(
      `Failed to get Soundcloud track details: ${error.response.data.message}`
    );
  }
};

export const getInstagramProfileMetadata: WidgetGetterFn = async (body) => {
  try {
    const response = await axios.post<WidgetDto>(
      `${env.NEXT_PUBLIC_SORBET_API_URL}/widgets/instagram`,
      body,
      await withAuthHeader()
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

export const getPhotoWidget: WidgetGetterFn = async (body) => {
  try {
    const response = await axios.post<WidgetDto>(
      `${env.NEXT_PUBLIC_SORBET_API_URL}/widgets/photo`,
      body,
      await withAuthHeader()
    );
    return response;
  } catch (error: any) {
    throw new Error(
      `Failed to get photo widget: ${error.response.data.message}`
    );
  }
};

export const getGithubProfile: WidgetGetterFn = async (body) => {
  try {
    const response = await axios.post<WidgetDto>(
      `${env.NEXT_PUBLIC_SORBET_API_URL}/widgets/github`,
      body,
      await withAuthHeader()
    );
    return response;
  } catch (error: any) {
    throw new Error(
      `Failed to get Github profile data: ${error.response.data.message}`
    );
  }
};

export const getTwitterProfile: WidgetGetterFn = async (body) => {
  try {
    const response = await axios.post<WidgetDto>(
      `${env.NEXT_PUBLIC_SORBET_API_URL}/widgets/twitter`,
      body,
      await withAuthHeader()
    );
    return response;
  } catch (error: any) {
    throw new Error(
      `Failed to get Twitter profile data: ${error.response.data.message}`
    );
  }
};

export const getLinkedInProfile: WidgetGetterFn = async (body) => {
  try {
    const response = await axios.post<WidgetDto>(
      `${env.NEXT_PUBLIC_SORBET_API_URL}/widgets/linkedin`,
      body,
      await withAuthHeader()
    );
    return response;
  } catch (error: any) {
    throw new Error(
      `Failed to get Linkedin profile data: ${error.response.data.message}`
    );
  }
};

export const getLinkData: WidgetGetterFn = async (body) => {
  try {
    const response = await axios.post<WidgetDto>(
      `${env.NEXT_PUBLIC_SORBET_API_URL}/widgets/link`,
      body,
      await withAuthHeader()
    );
    return response;
  } catch (error: any) {
    throw new Error(
      `Failed to get generic link data: ${error.response.data.message}`
    );
  }
};

type WidgetGetterFn = (
  body: GetWidgetBody
) => Promise<AxiosResponse<WidgetDto, unknown>>;

/** Currently, Figma and InstagramPost are not supported */
export type SupportedWidgetTypes = Exclude<
  WidgetType,
  'Figma' | 'InstagramPost'
>;

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
};

export type CreateWidgetParams = {
  /** The url to get the widget content for */
  url: string;
  /** The type of the widget to get */
  type: SupportedWidgetTypes;
};

/** Get/create a widget with the given url and type */
export const createWidget = async ({ url, type }: CreateWidgetParams) => {
  return widgetGetters[type]({ url });
};
