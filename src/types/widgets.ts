import type { Layout as WidgetLayout } from 'react-grid-layout';

export interface GetItemTypeBase {
  url: string;
}

export type GetDribbleShotType = GetItemTypeBase;
export type GetBehanceItemType = GetItemTypeBase;
export type GetMediumArticleType = GetItemTypeBase;
export type GetYouTubeVideoType = GetItemTypeBase;
export type GetSubstackArticleType = GetItemTypeBase;
export type GetSpotifyType = GetItemTypeBase;
export type GetSoundcloudType = GetItemTypeBase;
export type GetInstagramType = GetItemTypeBase;
export type GetPhotoWidget = GetItemTypeBase;
export type GetGithubWidget = GetItemTypeBase;
export type GetTwitterWidget = GetItemTypeBase;

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
  name: string;
  handle: string;
  bio: string;
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
  isPrivate: boolean;
}

export interface SoundcloudTrackContentType {
  title: string;
  artwork: string;
  trackUrl: string;
  artist: string;
}

/** This should match sorbet-api LinkMetadata */
export interface LinkWidgetContentType {
  title: string;
  description?: string;
  iconUrl?: string;
  heroImageUrl?: string;
}

/** This should match sorbet-api LinkedInProfileData */
export interface LinkedInProfileWidgetContentType {
  name: string;
  bio: string;
  bannerImage: string;
  profileImage: string;
}

export type WidgetType =
  // Explicitly Supported
  | 'Photo'
  | 'Substack'
  | 'SpotifySong'
  | 'SpotifyAlbum'
  | 'SoundcloudSong'
  | 'InstagramPost'
  | 'InstagramProfile'
  | 'TwitterProfile'
  | 'LinkedInProfile'
  | 'Link'

  // Supported via type catchall
  | 'Youtube'
  | 'Github'
  | 'Dribbble'
  | 'Behance'
  | 'Medium'
  | 'Figma'

  // Not yet supported
  | 'Twitter'
  | 'Nfts'
  | 'PhotoGallery'
  | 'Text';

export type WidgetSize = 'A' | 'B' | 'C' | 'D';

export const WidgetDimensions: Record<WidgetSize, { w: number; h: number }> = {
  A: { w: 2, h: 2 },
  B: { w: 4, h: 4 },
  C: { w: 4, h: 2 },
  D: { w: 2, h: 4 },
};

export const getWidgetDimensions = ({
  breakpoint = 'lg',
  size = 'A',
}: { breakpoint?: string; size?: WidgetSize } = {}) => {
  const dimensions = WidgetDimensions[size];
  const adjustedDimensions = { ...dimensions };
  return adjustedDimensions;
};

export interface ExtendedWidgetLayout extends WidgetLayout {
  type: WidgetType;
  loading?: boolean;
  redirectUrl?: string;
  content?: any;
  size: WidgetSize;
}

export interface UpdateWidgetsBulkDto {
  id: string;
  layout: { x: number; y: number; w: number; h: number };
  size: string;
}

export interface WidgetDto {
  id: string;
  type: string; // TODO: Should be a WidgetType
  size: string;
  content: any;
  redirectUrl?: string;
  layout: { x: number; y: number; w: number; h: number };
  userId: string;
  createdAt: string;
  updatedAt: string;
}
