import { WidgetType } from '@/types';

/**
 * Maps widget type to social icon.
 *
 * @param widgetType - The type of the widget.
 * @returns The path to the social icon image to be used as `src`
 */
export const getSocialIconForWidget = (widgetType: WidgetType): string => {
  const iconMap: { [key in WidgetType]?: string } = {
    [WidgetType.Nfts]: 'nft.png',
    [WidgetType.Photo]: 'default.png',
    [WidgetType.PhotoGallery]: 'gallery.png',
    [WidgetType.Youtube]: 'youtube.png',
    [WidgetType.YoutubePlaylist]: 'youtube.png',
    [WidgetType.SpotifySong]: 'spotify.png',
    [WidgetType.SpotifyAlbum]: 'spotify.png',
    [WidgetType.SoundcloudSong]: 'soundcloud.png',
    [WidgetType.Github]: 'github.png',
    [WidgetType.InstagramPost]: 'instagram.png',
    [WidgetType.InstagramProfile]: 'instagram.png',
    [WidgetType.TwitterProfile]: 'twitter.png',
    [WidgetType.Dribbble]: 'dribbble.png',
    [WidgetType.Behance]: 'behance.png',
    [WidgetType.Text]: 'text.png',
    [WidgetType.Medium]: 'medium.png',
    [WidgetType.Substack]: 'substack.png',
    [WidgetType.Figma]: 'figma.png',
    [WidgetType.Twitter]: 'twitter.png',
  };

  return `/images/social/${iconMap[widgetType] || 'default.png'}`;
};

export const parseWidgetTypeFromUrl = (url: string): WidgetType => {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    const pathname = urlObj.pathname;
    const domainParts = hostname.split('.');
    let platform =
      domainParts.length > 1 ? domainParts[domainParts.length - 2] : hostname;

    // Check if the URL is from a GCP storage bucket
    if (hostname.endsWith('storage.googleapis.com')) {
      return WidgetType.Photo;
    }

    if (platform.toLowerCase() === 'substack' && pathname.includes('/p/')) {
      return WidgetType.Substack;
    }

    if (platform.toLowerCase() === 'spotify') {
      if (pathname.includes('/album/')) {
        return WidgetType.SpotifyAlbum;
      } else if (pathname.includes('/track/')) {
        return WidgetType.SpotifySong;
      }
    }

    if (platform.toLowerCase() === 'soundcloud') {
      return WidgetType.SoundcloudSong;
    }

    if (platform.toLowerCase() === 'instagram') {
      if (pathname.includes('/p/')) {
        return WidgetType.InstagramPost;
      } else {
        return WidgetType.InstagramProfile;
      }
    }

    return WidgetType[
      (platform.charAt(0).toUpperCase() +
        platform.slice(1)) as keyof typeof WidgetType
    ];
  } catch (error) {
    console.error('Error parsing URL:', error);
    return WidgetType.Default;
  }
};
