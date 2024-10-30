import type { Layout } from 'react-grid-layout';

export interface GetWidgetBody {
  url: string;
}

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
  offsets?: { x: number; y: number };
  scale?: number;
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

/** Widget Content can be any of the following types per widget */
export type WidgetContentType =
  | DribbbleWidgetContentType
  | PhotoWidgetContentType
  | BehanceWidgetContentType
  | MediumArticleContentType
  | GithubWidgetContentType
  | TwitterWidgetContentType
  | FigmaWidgetContentType
  | YoutubeWidgetContentType
  | SubstackWidgetContentType
  | SpotifyWidgetContentType
  | InstagramWidgetContentType
  | SoundcloudTrackContentType
  | LinkWidgetContentType
  | LinkedInProfileWidgetContentType;

export const WidgetTypes = [
  'Photo',
  'Substack',
  'SpotifySong',
  'SpotifyAlbum',
  'SoundcloudSong',
  'InstagramPost', // Currently unsupported
  'InstagramProfile',
  'TwitterProfile',
  'LinkedInProfile',
  'Youtube',
  'Github',
  'Dribbble',
  'Behance',
  'Medium',
  'Figma', // Currently unsupported
  'Link', // Catchall if nothing else matches
] as const;

export type WidgetType = (typeof WidgetTypes)[number];

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

export interface UpdateWidgetsBulkDto {
  id: string;
  layout: { x: number; y: number; w: number; h: number };
  size: string;
}

/** This should match sorbet-api Widget in schema.prisma */
export interface WidgetDto {
  id: string;
  type: WidgetType;
  size: WidgetSize;
  content: WidgetContentType;
  redirectUrl?: string;
  layout: { x: number; y: number; w: number; h: number };
  userId: string;
  createdAt: string;
  updatedAt: string;
}

/** This is a widget with extra properties for display in RGL */
export type WidgetLayoutItem = Layout &
  Pick<WidgetDto, 'type' | 'size' | 'redirectUrl' | 'content'> & {
    id?: string; // added for updating widgets
    loading?: boolean;
  };
