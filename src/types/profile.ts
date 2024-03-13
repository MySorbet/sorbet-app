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

export interface WidgetType {
  id: string;
  url: string;
  type: string;
  userId: string;
  order: string;
}
