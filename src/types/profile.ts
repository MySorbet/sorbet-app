export interface ProfileAvatar {
  id: string;
  bucketName: string;
}

export interface Widget {
  id: string;
  type: 'Nfts' | 'Photo' | 'PhotoGallery' | 'YoutubeVideo' | 'YoutubePlaylist' | 'SpotifySong' | 'SpotifyAlbum' | 'SoundcloudSong' | 'Github' | 'InstagramPost' | 'InstagramProfile' | 'TwitterProfile' | 'Dribbble' | 'Behance' | 'Text';
  title: string;
  description: string;
  content: JSON;
  coords: JSON;
  createdAt: string;
  updatedAt: string;
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

export interface WidgetType {
  id: string;
  url: string;
  type: string;
  userId: string;
  order: string;
}
