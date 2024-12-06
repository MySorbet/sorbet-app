import { Dispatch, SetStateAction } from 'react';
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

export interface BaseWidgetProps {
  identifier: string;
  showControls?: boolean;
  setErrorInvalidImage: Dispatch<SetStateAction<boolean>>;
  addImage: (key: string, image: File) => Promise<void>;
  removeImage: (key: string) => Promise<void>;
  size: WidgetSize;
  redirectUrl?: string;
  handleRestoreImage: (
    key: string,
    type: WidgetType,
    redirectUrl: string,
    content: WidgetContentType
  ) => Promise<void>;
}

export interface DribbbleWidgetContentType {
  image: string | undefined;
  title: string;
  description: string;
}

export interface PhotoWidgetContentType {
  image: string;
  isCropped?: boolean;
  croppedArea?: { x: number; y: number; width: number; height: number };
}

export interface BehanceWidgetContentType {
  image: string | undefined;
  title: string;
  description: string;
}

export interface MediumArticleContentType {
  title: string;
  image: string | undefined;
  host: string;
}

export interface GithubWidgetContentType {
  title: string;
  image: string | undefined;
}

export interface TwitterWidgetContentType {
  name: string;
  handle: string;
  bio: string;
  bannerImage: string | undefined;
  profileImage: string;
}

export interface FigmaWidgetContentType {
  title: string;
  description: string;
  image: string;
}

export interface YoutubeWidgetContentType {
  title: string;
  thumbnail: string | undefined;
  url: string;
}

export interface SubstackWidgetContentType {
  title: string;
  image: string | undefined;
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
  artwork: string | undefined;
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
  bannerImage: string | undefined;
  profileImage: string;
}

export interface SectionTitleWidgetContentType {
  title: string;
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
  | LinkedInProfileWidgetContentType
  | SectionTitleWidgetContentType;

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
  'SectionTitle',
] as const;

export type WidgetType = (typeof WidgetTypes)[number];

export type WidgetSize = 'A' | 'B' | 'C' | 'D' | 'Section';

export const WidgetDimensions: Record<WidgetSize, { w: number; h: number }> = {
  A: { w: 2, h: 2 },
  B: { w: 4, h: 4 },
  C: { w: 4, h: 2 },
  D: { w: 2, h: 4 },
  Section: { w: 4, h: 1 },
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
  content?: WidgetContentType; // for resetting photo cropping
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
    id?: string; // used for updating widget
    loading?: boolean;
  };
