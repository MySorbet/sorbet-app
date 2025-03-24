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
] as const;

export type UrlType = (typeof UrlTypes)[number];
