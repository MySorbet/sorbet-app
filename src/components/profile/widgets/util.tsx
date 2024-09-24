import { parseURL, stringifyParsedURL, withoutTrailingSlash } from 'ufo';

import { SupportedWidgetTypes } from '@/lib/service';
import { WidgetType } from '@/types';

/**
 * Parses the WidgetType from a given URL
 * Make sure to call this with a normalized URL
 * @param url The url to parse
 * @returns the WidgetType of the given URL
 * @throws an error if the URL is invalid in some way
 */
export const parseWidgetTypeFromUrl = (url: string): SupportedWidgetTypes => {
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

  // Instagram posts only
  if (platform === 'instagram') {
    // Explicitly exclude stories
    if (pathname.includes('stories')) {
      throw new Error('Instagram stories are not supported');
    }

    // Explicitly exclude posts
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

  // LinkedIn profiles only
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

  // Github profiles, orgs, repos, files, etc.
  if (platform === 'github') {
    return 'Github';
  }

  // Only dribbble shots
  if (platform === 'dribbble') {
    if (pathname.includes('/shots/')) {
      return 'Dribbble';
    }
    throw new Error('Only Dribbble shots are supported');
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
      throw new Error('Figma is not yet supported');
      // return 'Figma'; // TODO: Uncomment when Figma is supported
    }
    throw new Error('Figma is not yet supported');
    // TODO: Uncomment when Figma is supported
    // throw new Error('Only Figma design files are supported');
  }

  // If you get here, it's not a platform we explicitly support
  // So it's a generic link
  console.log('Parsed as generic link: ', url);
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

  // Exclude urls without a TLD (i.e. "a.")
  const hasTLD = (parsed.host?.split('.').filter(Boolean).length ?? 0) >= 2;

  // We accept http and https urls with a TLD
  if ((parsed.protocol === 'http:' || parsed.protocol === 'https:') && hasTLD) {
    return stringifyParsedURL(parsed);
  }

  // invalid url
  return undefined;
}

/**
 * Uses `parseWidgetTypeFromUrl` with the added layer of checking the url against regex's in the original implementation.
 * Currently unused. Will be removed if new url validation proves to be more reliable.
 */
export const parseWidgetTypeWithRegex = (url: string): WidgetType | null => {
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
