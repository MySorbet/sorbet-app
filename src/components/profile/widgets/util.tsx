import { WidgetType } from '@/types';

/**
 * Maps widget type to social icon.
 *
 * @param widgetType - The type of the widget.
 * @returns The path to the social icon image to be used as `src`
 */
export const getSocialIconForWidget = (widgetType: WidgetType): string => {
  const iconMap: Record<WidgetType, string> = {
    Nfts: 'nft.png',
    Photo: 'default.png',
    PhotoGallery: 'gallery.png',
    Youtube: 'youtube.png',
    SpotifySong: 'spotify.png',
    SpotifyAlbum: 'spotify.png',
    SoundcloudSong: 'soundCloud.png',
    Github: 'github.png',
    InstagramPost: 'instagram.png',
    InstagramProfile: 'instagram.png',
    TwitterProfile: 'twitter.png',
    Dribbble: 'dribbble.png',
    Behance: 'behance.png',
    Text: 'text.png',
    Medium: 'medium.png',
    Substack: 'substack.png',
    Figma: 'figma.png',
    Twitter: 'twitter.png',
    LinkedInProfile: 'linkedIn.png',
    Link: 'default.png',
  };

  return `/images/social/${iconMap[widgetType]}`;
};

/**
 * Parses the WidgetType from a given URL
 * @param url The url to parse
 * @returns the WidgetType of the given URL
 * @throws an error if the URL is invalid in some way
 */
export const parseWidgetTypeFromUrl = (url: string): WidgetType => {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    const pathname = urlObj.pathname;
    const domainParts = hostname.split('.');
    const platform =
      domainParts.length > 1 ? domainParts[domainParts.length - 2] : hostname;

    // If the URL is from a GCP storage bucket, this is a photo widget
    if (hostname.endsWith('storage.googleapis.com')) {
      return 'Photo';
    }

    // Substack posts only
    // TODO: Exclude profiles here and callout in UI
    if (platform.toLowerCase() === 'substack' && pathname.includes('/p/')) {
      return 'Substack';
    }

    // Spotify songs and albums
    if (platform.toLowerCase() === 'spotify') {
      if (pathname.includes('/album/')) {
        return 'SpotifyAlbum';
      } else if (pathname.includes('/track/')) {
        return 'SpotifySong';
      }
    }

    // Soundcloud songs
    // TODO: Exclude profiles here and callout in UI
    if (platform.toLowerCase() === 'soundcloud') {
      return 'SoundcloudSong';
    }

    // Instagram posts and profiles
    if (platform.toLowerCase() === 'instagram') {
      if (pathname.includes('/p/')) {
        return 'InstagramPost';
      } else {
        return 'InstagramProfile';
      }
    }

    // Twitter / X. Currently only profiles are supported.
    // TODO callout the exclusion of posts in the UI
    if (
      platform.toLowerCase() === 'twitter' ||
      platform.toLowerCase() === 'x'
    ) {
      if (pathname.includes('/status/')) {
        return 'Twitter';
      } else {
        return 'TwitterProfile';
      }
    }

    // LinkedIn profiles
    // TODO: Include or exclude posts
    if (platform.toLowerCase() === 'linkedin') {
      return 'LinkedInProfile';
    }

    // The rest of the platforms are supported by manipulating the string
    if (
      ['figma', 'medium', 'behance', 'dribbble', 'github', 'youtube'].includes(
        platform.toLowerCase()
      )
    ) {
      return (platform.charAt(0).toUpperCase() +
        platform.slice(1)) as WidgetType;
    }

    // If you get here, it's a generic link
    console.log('Typed as Generic link: ', url);
    return 'Link';
  } catch (error) {
    throw new Error('Error parsing URL:' + error);
  }
};

// TODO: This function should be combined with the above.
// into a single function that returns the widget type if
// the url is valid or throws an error if it is not.
// It should provide specific info about why it was not valid or not supported
/**
 * Check if a given url is valid
 *
 * @param url The url to check for validity
 * @returns whether the url is valid or not
 * @throws if the hostname is not supported. Can also throw TypeError if the URL is invalid
 */
export function validateUrl(url: string) {
  // This will throw if it is not a valid url
  const urlObj = new URL(url);
  const hostname = urlObj.hostname;

  // Now we will build a regex to test against based on hostname
  let regex: RegExp;

  if (hostname.includes('youtu.be') || hostname.includes('youtube.com')) {
    regex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  } else if (hostname.includes('spotify.com')) {
    regex =
      /^(https?:\/\/)?(www\.)?(open\.spotify\.com\/(user\/[a-zA-Z0-9]+\/)?(playlist|track|album|show|episode)\/[a-zA-Z0-9]+).*$/;
  } else if (hostname.includes('github.com')) {
    regex = /^(https?:\/\/)?(www\.)?(github\.com\/[a-zA-Z0-9-_]+)\/?$/;
  } else if (hostname.includes('dribbble.com')) {
    regex = /^https?:\/\/dribbble\.com\/shots\/\d+-[^\/]+$/;
  } else if (hostname.includes('soundcloud.com')) {
    regex = /^https?:\/\/(www\.)?soundcloud\.com\/[^\/]+\/[^\/]+$/;
  } else if (hostname.includes('instagram.com')) {
    regex =
      /^(https?:\/\/)?(www\.)?instagram\.com\/(p\/[a-zA-Z0-9-_]+\/?|[^\/]+\/?)$/;
  } else if (hostname.includes('substack.com')) {
    regex = /^https?:\/\/([a-zA-Z0-9]+\.substack\.com\/).*$/;
  } else if (hostname.includes('behance.net')) {
    regex = /^https?:\/\/(www\.)?behance\.net\/gallery\/[a-zA-Z0-9]+\/[^\/]+$/;
  } else if (hostname.includes('medium.com')) {
    regex =
      /^https?:\/\/(www\.)?medium\.com\/@?[a-zA-Z0-9-]+(\/[a-zA-Z0-9-]+)?$/;
  } else if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
    regex = /^(https?:\/\/)?(www\.)?(twitter|x)\.com\/[a-zA-Z0-9_]+\/?$/;
  } else if (hostname.includes('linkedin.com')) {
    regex = /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_]+\/?$/;
  }
  // TODO: Support figma
  else {
    // If you get here, it's a generic link or it is not valid
    // So if this is http(s), it's generic and we can return true
    if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
      console.log('Generic link: ', url);
      return true;
    }
    // Otherwise, it's not valid so throw
    throw new Error(`Invalid hostname: ${hostname}`);
  }

  // And then of course, if you matched on of the statements above, text the regex against it
  return regex.test(url);
}
