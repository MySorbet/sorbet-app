import type { Layout as WidgetLayout } from 'react-grid-layout';

export interface GetItemTypeBase {
  url: string;
}

export interface GetDribbleShotType extends GetItemTypeBase {}

export interface GetBehanceItemType extends GetItemTypeBase {}

export interface GetMediumArticleType extends GetItemTypeBase {}

export interface GetYouTubeVideoType extends GetItemTypeBase {}

export interface GetSubstackArticleType extends GetItemTypeBase {}

export interface GetSpotifyType extends GetItemTypeBase {}

export interface GetSoundcloudType extends GetItemTypeBase {}

export interface GetInstagramType extends GetItemTypeBase {}

export interface GetPhotoWidget extends GetItemTypeBase {}

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  description: string;
  content: JSON;
  coords: JSON;
  createdAt: string;
  updatedAt: string;
}

export interface DribbbleWidgetContentType {
  image: string;
  title: string;
  description: string;
}

export interface PhotoWidgetContentType {
  image: string;
}

export interface BehanceWidgetContentType {
  image: string;
  title: string;
  description: string;
}

export interface MediumArticleContentType {
  title: string;
  image: string;
  host: string;
}

export interface GithubWidgetContentType {
  title: string;
  image: string;
}

export interface TwitterWidgetContentType {
  accountName: string;
  accountDescription: string;
  bannerImage: string;
  profileImage: string;
}

export interface FigmaWidgetContentType {
  title: string;
  description: string;
  image: string;
}

export interface YoutubeWidgetContentType {
  title: string;
  thumbnail: string;
  url: string;
}

export interface SubstackWidgetContentType {
  title: string;
  image: string;
  host: string;
}

export interface SpotifyWidgetContentType {
  title: string;
  album?: string;
  cover: string;
  artist: string;
  url: string;
}

export interface InstagramWidgetContentType {
  handle: string;
  images: string[];
}

export interface SoundcloudTrackContentType {
  title: string;
  artwork: string;
  trackUrl: string;
  artist: string;
}

export enum WidgetType {
  Default = 'Default',
  Nfts = 'Nfts',
  Photo = 'Photo',
  PhotoGallery = 'PhotoGallery',
  Youtube = 'Youtube',
  YoutubePlaylist = 'YoutubePlaylist',
  SpotifySong = 'SpotifySong',
  SpotifyAlbum = 'SpotifyAlbum',
  SoundcloudSong = 'SoundcloudSong',
  Github = 'Github',
  InstagramPost = 'InstagramPost',
  InstagramProfile = 'InstagramProfile',
  TwitterProfile = 'TwitterProfile',
  Twitter = 'Twitter',
  Dribbble = 'Dribbble',
  Behance = 'Behance',
  Text = 'Text',
  Medium = 'Medium',
  Substack = 'Substack',
  Figma = 'Figma',
}

export enum WidgetSize {
  A,
  B, 
  C,
  D
}

export const WidgetDimensions: { [key in WidgetSize]: { w: number, h: number } } = {
  [WidgetSize.A]: { w: 2, h: 2 },
  [WidgetSize.B]: { w: 4, h: 4 },
  [WidgetSize.C]: { w: 4, h: 2 },
  [WidgetSize.D]: { w: 2, h: 4 },
};

export const getWidgetDimensions = ({ breakpoint = 'lg', size = WidgetSize.A }: { breakpoint?: string, size?: WidgetSize } = {}) => {
  const dimensions = WidgetDimensions[size];
  let adjustedDimensions = { ...dimensions };
  
  // if ((size === WidgetSize.C || size === WidgetSize.D) && (['xxs', 'xs', 'sm', 'md'].includes(breakpoint))) {
  //   adjustedDimensions = { w: 2, h: 2 };
  // } 

  // switch (breakpoint) {
  //   case 'xxs':
  //     adjustedDimensions.w = Math.max(1, Math.floor(dimensions.w * 0.3));
  //     adjustedDimensions.h = Math.max(1, Math.floor(dimensions.h * 0.3));
  //     break;
  //   case 'xs':
  //     adjustedDimensions.w = Math.max(1, Math.floor(dimensions.w * 0.5));
  //     adjustedDimensions.h = Math.max(1, Math.floor(dimensions.h * 0.5));
  //     break;
  //   case 'sm':
  //     adjustedDimensions.w = Math.max(1, Math.floor(dimensions.w * 0.75));
  //     adjustedDimensions.h = Math.max(1, Math.floor(dimensions.h * 0.75));
  //     break;
  //   case 'md':
  //     adjustedDimensions.w = Math.max(1, Math.floor(dimensions.w * 0.8));
  //     adjustedDimensions.h = Math.max(1, Math.floor(dimensions.h * 0.8));
  //     break;
  //   case 'lg':
  //     adjustedDimensions = { ...dimensions };
  //     break;
  //   case 'xl':
  //     adjustedDimensions = { ...dimensions };
  //     break;
  //   default:
  //     adjustedDimensions = { ...dimensions };
  // }

  return adjustedDimensions;
}

export interface ExtendedWidgetLayout extends WidgetLayout {
  type: WidgetType;
  loading?: boolean;
  content?: any;
  size: WidgetSize;
}

export interface UpdateWidgetsBulkDto {
  id: string;
  layout: { x: number, y: number, w: number, h: number }
  size: string;
}

export interface WidgetDto {
  id: string;
  type: string;
  size: string;
  content: any;
  layout: { x: number, y: number, w: number, h: number }
  userId: string;
  createdAt: string;
  updatedAt: string;
}