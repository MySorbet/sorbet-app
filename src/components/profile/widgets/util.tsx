import { parseURL, stringifyParsedURL, withoutTrailingSlash } from 'ufo';

import { WidgetType } from '@/types';

/**
 * Maps widget type to social icon.
 *
 * @param widgetType - The type of the widget.
 * @returns The path to the social icon image to be used as `src`
 */
export const getSocialIconForWidget = (widgetType: WidgetType): string => {
  const iconMap: Record<WidgetType, string> = {
    Photo: 'default.png',
    Substack: 'substack.png',
    SpotifySong: 'spotify.png',
    SpotifyAlbum: 'spotify.png',
    SoundcloudSong: 'soundCloud.png',
    InstagramPost: 'instagram.png',
    InstagramProfile: 'instagram.png',
    TwitterProfile: 'twitter.png',
    LinkedInProfile: 'linkedIn.png',
    Youtube: 'youtube.png',
    Github: 'github.png',
    Dribbble: 'dribbble.png',
    Behance: 'behance.png',
    Medium: 'medium.png',
    Figma: 'figma.png',
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
  const urlObj = new URL(url);
  const hostname = urlObj.hostname;
  const pathname = urlObj.pathname;
  const domainParts = hostname.split('.');
  const platform = (
    domainParts.length > 1 ? domainParts[domainParts.length - 2] : hostname
  ).toLowerCase();

  // If the URL is from a GCP storage bucket, this is a photo widget
  if (hostname.endsWith('storage.googleapis.com')) {
    return 'Photo';
  }

  // Substack posts only
  // TODO: Exclude profiles here and callout in UI
  if (platform === 'substack') {
    if (pathname.includes('/p/')) {
      return 'Substack';
    }
    throw new Error('Only Substack posts are supported');
  }

  // Spotify songs and albums
  if (platform === 'spotify') {
    if (pathname.includes('/album/')) {
      return 'SpotifyAlbum';
    } else if (pathname.includes('/track/')) {
      return 'SpotifySong';
    }
    throw new Error('Only Spotify songs and albums are supported');
  }

  // Soundcloud songs only
  if (platform === 'soundcloud') {
    if (pathname.includes('/sets/')) {
      throw new Error('Soundcloud playlists and albums are not supported');
    }

    if (domainParts[0] === 'on') {
      throw new Error('Soundcloud short links are not supported');
    }

    // Songs are always under an artist, so you can check the number of segments
    const numSegments = withoutTrailingSlash(pathname).split('/').length - 1;
    if (numSegments === 2) {
      return 'SoundcloudSong';
    }

    // Otherwise this was not supported
    throw new Error('Only Soundcloud songs are supported');
  }

  // Instagram posts and profiles
  if (platform === 'instagram') {
    // Explicitly exclude stories
    if (pathname.includes('stories')) {
      throw new Error('Instagram stories are not supported');
    }

    if (pathname.includes('/p/')) {
      throw new Error('Only Instagram profiles are supported');
      // TODO: This will be supported
      // return 'InstagramPost';
    } else {
      return 'InstagramProfile';
    }
  }

  // Twitter / X. Currently only profiles are supported.
  if (platform === 'twitter' || platform === 'x') {
    if (pathname.includes('/status/')) {
      throw new Error('Twitter posts are not supported');
    } else {
      return 'TwitterProfile';
    }
  }

  // LinkedIn profiles
  if (platform === 'linkedin') {
    // Explicitly exclude posts
    if (pathname.includes('/posts/')) {
      throw new Error('LinkedIn posts are not supported');
    }
    // Explicitly exclude posts
    if (pathname.includes('/company/')) {
      throw new Error('LinkedIn companies are not supported');
    }
    return 'LinkedInProfile';
  }

  // Only youtube videos
  if (platform === 'youtu' || platform === 'youtube') {
    if (pathname.includes('/shorts/')) {
      throw new Error('Youtube shorts are not supported');
    }
    if (pathname.includes('@')) {
      throw new Error('Youtube channels are not supported');
    }
    return 'Youtube';
  }

  // The rest of the platforms are supported by manipulating the string
  if (['github', 'dribbble', 'behance', 'medium', 'figma'].includes(platform)) {
    return (platform.charAt(0).toUpperCase() + platform.slice(1)) as WidgetType;
  }

  // If you get here, it's a generic link
  console.log('Typed as Generic link: ', url);
  return 'Link';
};

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

  // Exclude "a."
  const hasTLD = (parsed.host?.split('.').filter(Boolean).length ?? 0) >= 2;

  if ((parsed.protocol === 'http:' || parsed.protocol === 'https:') && hasTLD) {
    return stringifyParsedURL(parsed);
  }

  // invalid url
  return undefined;
}

/**
 * Uses the above validation with the added layer of checking the url against the regex's in the original implementation.
 * Currently unused.
 */
export const getWidgetTypeWithRegex = (url: string): WidgetType | null => {
  const type = parseWidgetTypeFromUrl(url);

  // If the widget type is in the exclusion list, return it
  if (Exclusions.includes(type as Exclusion)) {
    return type;
  }

  // Otherwise, use the regex to check if the url is valid
  const regex = regexMap[type as Exclude<WidgetType, Exclusion>];
  return regex.test(url) ? type : null;
};

// Exclusions are widget types that did not have regex
const Exclusions = ['Photo', 'Figma', 'Link'] as const;
type Exclusion = (typeof Exclusions)[number];

const regexMap: Record<Exclude<WidgetType, Exclusion>, RegExp> = {
  Substack: /^https?:\/\/([a-zA-Z0-9]+\.substack\.com\/).*$/,
  SpotifySong:
    /^(https?:\/\/)?(www\.)?(open\.spotify\.com\/(user\/[a-zA-Z0-9]+\/)?(playlist|track|album|show|episode)\/[a-zA-Z0-9]+).*$/,
  SpotifyAlbum:
    /^(https?:\/\/)?(www\.)?(open\.spotify\.com\/(user\/[a-zA-Z0-9]+\/)?(playlist|track|album|show|episode)\/[a-zA-Z0-9]+).*$/,
  SoundcloudSong: /^https?:\/\/(www\.)?soundcloud\.com\/[^\/]+\/[^\/]+$/,
  InstagramPost:
    /^(https?:\/\/)?(www\.)?instagram\.com\/(p\/[a-zA-Z0-9-_]+\/?|[^\/]+\/?)$/,
  InstagramProfile:
    /^(https?:\/\/)?(www\.)?instagram\.com\/(p\/[a-zA-Z0-9-_]+\/?|[^\/]+\/?)$/,
  LinkedInProfile: /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_]+\/?$/,
  Youtube: /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/,
  Github: /^(https?:\/\/)?(www\.)?(github\.com\/[a-zA-Z0-9-_]+)\/?$/,
  Dribbble: /^https?:\/\/dribbble\.com\/shots\/\d+-[^\/]+$/,
  Behance: /^https?:\/\/(www\.)?behance\.net\/gallery\/[a-zA-Z0-9]+\/[^\/]+$/,
  Medium: /^https?:\/\/(www\.)?medium\.com\/@?[a-zA-Z0-9-]+(\/[a-zA-Z0-9-]+)?$/,
  TwitterProfile: /^(https?:\/\/)?(www\.)?(twitter|x)\.com\/[a-zA-Z0-9_]+\/?$/,
};
