export const getSocialIconForWidget = (widgetType: string) => {
  const iconMap: { [key: string]: string } = {
    nfts: 'nft.png',
    photo: 'photo.png',
    photogallery: 'gallery.png',
    youtubevideo: 'youtube.png',
    youtubeplaylist: 'youtube.png',
    spotifysong: 'spotify.png',
    spotifyalbum: 'spotify.png',
    soundcloudsong: 'spotify.png',
    github: 'github.png',
    instagrampost: 'instagram.png',
    instagramprofile: 'instagram.png',
    twitterprofile: 'twitter.png',
    dribbble: 'dribbble.png',
    behance: 'behance.png',
    text: 'text.png',
  };

  return `/images/social/${iconMap[widgetType] || 'default.png'}`;
};

export const parseHostnameAndRetrieveIcon = (url: string): string => {
  try {
    const hostname = new URL(url).hostname;
    const domainParts = hostname.split('.');
    const platform =
      domainParts.length > 1 ? domainParts[domainParts.length - 2] : hostname;
    console.log(platform.charAt(0).toUpperCase() + platform.slice(1));
    return getSocialIconForWidget(
      platform.charAt(0).toUpperCase() + platform.slice(1)
    );
  } catch (error) {
    console.error('Error parsing URL:', error);
    return getSocialIconForWidget('default');
  }
};

export const parseWidgetTypeFromUrl = (url: string): string => {
  try {
    const hostname = new URL(url).hostname;
    const domainParts = hostname.split('.');
    const platform =
      domainParts.length > 1 ? domainParts[domainParts.length - 2] : hostname;

    return platform.charAt(0).toUpperCase() + platform.slice(1);
  } catch (error) {
    console.error('Error parsing URL:', error);
    return 'default';
  }
};
