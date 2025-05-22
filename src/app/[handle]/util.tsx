import { toast } from 'sonner';
import { parseURL, stringifyParsedURL } from 'ufo';
import { withoutTrailingSlash } from 'ufo';

// TODO: Set up test based on old tests for this stuff

/**
 * Parses the UrlType from a given URL
 * Make sure to call this with a normalized URL
 * Returns undefined if the URL is not recognized as a particular type
 */
export const getUrlType = (url: string): UrlType | undefined => {
  const urlObj = new URL(url);
  const hostname = urlObj.hostname;
  const pathname = urlObj.pathname;
  const domainParts = hostname.split('.');
  const platform = (
    domainParts.length > 1 ? domainParts[domainParts.length - 2] : hostname
  ).toLowerCase();

  // Substack posts only
  if (platform === 'substack') {
    if (pathname.includes('/p/')) {
      return 'SubstackPost';
    }
    return 'Substack';
  }

  // Spotify songs and albums
  if (platform === 'spotify') {
    if (pathname.includes('/album/')) {
      return 'SpotifyAlbum';
    } else if (pathname.includes('/track/')) {
      return 'SpotifySong';
    }
    return 'Spotify';
  }

  // Soundcloud songs only
  if (platform === 'soundcloud') {
    if (pathname.includes('/sets/')) {
      return 'SoundcloudPlaylistAlbum';
    }

    if (domainParts[0] === 'on') {
      return 'SoundcloudShortLink';
    }

    // Songs are always under an artist, so you can check the number of segments
    const numSegments = withoutTrailingSlash(pathname).split('/').length - 1;
    if (numSegments === 2) {
      return 'SoundcloudSong';
    }

    // Otherwise this was not supported
    return 'Soundcloud';
  }

  // Instagram posts only
  if (platform === 'instagram') {
    // Explicitly exclude stories
    if (pathname.includes('stories')) {
      return 'InstagramStory';
    }

    // Explicitly exclude posts
    if (pathname.includes('/p/')) {
      return 'InstagramPost';
    } else {
      return 'InstagramProfile';
    }
  }

  // Twitter / X. Currently only profiles are supported.
  if (platform === 'twitter' || platform === 'x') {
    if (pathname.includes('/status/')) {
      return 'TwitterPost';
    } else {
      return 'TwitterProfile';
    }
  }

  // LinkedIn profiles only
  if (platform === 'linkedin') {
    // Explicitly exclude posts
    if (pathname.includes('/posts/')) {
      return 'LinkedInPost';
    }
    // Explicitly exclude posts
    if (pathname.includes('/company/')) {
      return 'LinkedInCompany';
    }
    return 'LinkedInProfile';
  }

  // Only youtube videos
  if (platform === 'youtu' || platform === 'youtube') {
    if (pathname.includes('/shorts/')) {
      return 'YoutubeShorts';
    }
    if (pathname.includes('@')) {
      return 'YoutubeChannel';
    }
    return 'Youtube';
  }

  // Github profiles, orgs, repos, files, etc.
  if (platform === 'github') {
    return 'Github';
  }

  // Only dribbble shots
  if (platform === 'dribbble') {
    if (pathname.includes('/shots/')) {
      return 'Dribbble';
    }
    return 'DribbbleProfile';
  }

  // Behance galleries and profiles
  if (platform === 'behance') {
    return 'Behance';
  }

  // Medium articles and profiles
  if (platform === 'medium') {
    return 'Medium';
  }

  // Figma design files only
  if (platform === 'figma') {
    if (pathname.includes('/design/')) {
      return 'FigmaDesign';
    }
    return 'Figma';
  }

  // Farcaster posts and profiles
  if (platform === 'warpcast') {
    return 'Farcaster';
  }

  // Zora
  if (platform === 'zora') {
    return 'Zora';
  }

  // Discord
  if (platform === 'discord' || platform === 'discordapp') {
    return 'Discord';
  }

  // If you get here, it's not a platform we explicitly support
  return undefined;
};

export const UrlTypes = [
  'Substack',
  'SpotifySong',
  'SpotifyAlbum',
  'SoundcloudSong',
  'InstagramPost',
  'InstagramProfile',
  'TwitterProfile',
  'LinkedInProfile',
  'Youtube',
  'Github',
  'Dribbble',
  'Behance',
  'Medium',
  'Figma',
  'FigmaDesign',
  'DribbbleProfile',
  'YoutubeShorts',
  'YoutubeChannel',
  'TwitterPost',
  'SubstackPost',
  'Soundcloud',
  'SoundcloudPlaylistAlbum',
  'SoundcloudShortLink',
  'InstagramStory',
  'LinkedInPost',
  'LinkedInCompany',
  'Spotify',
  'Farcaster',
  'Zora',
  'Discord',
] as const;

export type UrlType = (typeof UrlTypes)[number];

/**
 * Validates a URL by normalizing it and checking if it's in a valid format.
 * @param url The URL to validate
 * @returns True if the URL is valid, false otherwise
 */
export function isValidUrl(url: string) {
  return normalizeUrl(url) !== undefined;
}

/**
 * Normalizes a URL by parsing it and ensuring it's in a valid format.
 * Adds a protocol if it's missing. Returns undefined for invalid URLs.
 *
 * We use [ufo](https://github.com/unjs/ufo) to parse as opposed to `new URL` because it is more ergonomic.
 */
export function normalizeUrl(url: string): string | undefined {
  const parsed = parseURL(url, 'https://');

  // Exclude urls without a TLD (i.e. "a.")
  const hasTLD = (parsed.host?.split('.').filter(Boolean).length ?? 0) >= 2;

  // We accept http and https urls with a TLD
  if ((parsed.protocol === 'http:' || parsed.protocol === 'https:') && hasTLD) {
    return stringifyParsedURL(parsed);
  }

  // invalid url
  return undefined;
}

export const validImageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg'];

/** Valid file extensions with dots for use in the `accept` attribute of a file input */
export const validImageExtensionsWithDots = validImageExtensions.map(
  (ext) => `.${ext}`
);

export const checkFileValid = (file?: File): file is File => {
  if (!file) return false;
  const fileSize = file.size / 1024 / 1024; // in MB
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  if (!fileExtension) return false;
  return validImageExtensions.includes(fileExtension) && fileSize <= 10;
};

/**
 * Renders an error toast if an image is not valid.
 */
const errorToast = () =>
  toast.error("We couldn't add this image", {
    description: `Images must be smaller than 10MB and be on the following formats: ${validImageExtensions.join(
      ', '
    )}`,
  });

/**
 * Curry a function that calls a callback only if the file is valid, shows an error toast if it's not, and resets the input.
 */
export const handleImageInputChange =
  (onAdd: (file: File) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only support the first file (input should limit anyway)
    const file = e.target.files?.[0];
    if (checkFileValid(file)) {
      onAdd?.(file);
    } else {
      // This should only ever toast with 10mb error (since the input only accepts valid extensions)
      errorToast();
    }
  };

/**
 * Curry a function that calls a callback only if the file is valid, and shows an error toast if it's not.
 */
export const ifValidImage = (onAdd: (file: File) => void) => (file: File) => {
  if (checkFileValid(file)) {
    onAdd?.(file);
  } else {
    errorToast();
  }
};
