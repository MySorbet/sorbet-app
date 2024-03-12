export const getSocialIconForWidget = (widgetType: string) => {
  const iconMap: { [key: string]: string } = {
    Nfts: 'nft.png',
    Photo: 'photo.png',
    PhotoGallery: 'gallery.png',
    YoutubeVideo: 'youtube.png',
    YoutubePlaylist: 'youtube.png',
    SpotifySong: 'spotify.png',
    SpotifyAlbum: 'spotify.png',
    SoundcloudSong: 'spotify.png',
    Github: 'github.png',
    InstagramPost: 'instagram.png',
    InstagramProfile: 'instagram.png',
    TwitterProfile: 'twitter.png',
    Dribbble: 'dribbble.png',
    Behance: 'behance.png',
    Text: 'text.png',
  };

  return `/images/social/${iconMap[widgetType] || 'default.png'}`;
};
