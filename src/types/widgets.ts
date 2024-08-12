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

export interface GetGithubWidget extends GetItemTypeBase {}

export interface GetTwitterWidget extends GetItemTypeBase {}
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

export enum WidgetSize {
  A,
  B,
  C,
  D,
}

export const WidgetDimensions: {
  [key in WidgetSize]: { w: number; h: number };
} = {
  [WidgetSize.A]: { w: 2, h: 2 },
  [WidgetSize.B]: { w: 4, h: 4 },
  [WidgetSize.C]: { w: 4, h: 2 },
  [WidgetSize.D]: { w: 2, h: 4 },
};

export const getWidgetDimensions = ({
  breakpoint = 'lg',
  size = WidgetSize.A,
}: { breakpoint?: string; size?: WidgetSize } = {}) => {
  const dimensions = WidgetDimensions[size];
  let adjustedDimensions = { ...dimensions };
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
