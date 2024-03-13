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
  [WidgetSize.A]: { w: 3, h: 4 },
  [WidgetSize.B]: { w: 6, h: 8 },
  [WidgetSize.C]: { w: 6, h: 4 },
  [WidgetSize.D]: { w: 3, h: 8 },
};

export interface WidgetType {
  id: string;
  url: string;
  type: string;
  userId: string;
  order: string;
}
