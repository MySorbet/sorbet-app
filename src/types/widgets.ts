export interface GetDribbleShotType {
  url: string;
}

export interface GetBehanceItemType {
  url: string;
}

export interface GetMediumArticleType {
  url: string;
}

export interface GetYouTubeVideoType {
  url: string;
}

export interface GetSubstackArticleType {
  url: string;
}

export interface GetSpotifyAlbumType {
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
}

export interface BehanceWidgetContentType {
  image: string;
}

export interface MediumArticleContentType {
  title: string;
  image: string;
  host: string;
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
  cover: string;
  artist: string;
  albumUrl: string;
  songs: {name: string, length: number}[];
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
  Dribbble = 'Dribbble',
  Behance = 'Behance',
  Text = 'Text',
  Medium = 'Medium',
  Substack = 'Substack',
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