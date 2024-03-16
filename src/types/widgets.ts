export interface GetDribbleShotType {
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

export enum WidgetType {
  Default = 'Default',
  Nfts = 'Nfts',
  Photo = 'Photo',
  PhotoGallery = 'PhotoGallery',
  YoutubeVideo = 'YoutubeVideo',
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