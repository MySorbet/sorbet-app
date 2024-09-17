import { isValidUrl, parseWidgetTypeFromUrl } from './util';

/**
 *  Helper to expect `parseWidgetTypeFromUrl` to return a specific widget type.
 * @param url - The URL to parse.
 * @param expectedType - The expected widget type.
 */
const expectParseToReturn = (url: string, expectedType: string) => {
  expect(parseWidgetTypeFromUrl(url)).toBe(expectedType);
};

/**
 *  Helper to expect `parseWidgetTypeFromUrl` to throw an error.
 * @param url - The URL to parse.
 */
const expectParseToThrow = (url: string) => {
  expect(() => parseWidgetTypeFromUrl(url)).toThrow();
};

/**
 *  Helper to expect `isValidUrl` to return true.
 * @param url - The URL to validate.
 */
const expectUrlToBeValid = (url: string) => {
  expect(isValidUrl(url)).toBe(true);
};

/**
 *  Helper to expect `isValidUrl` to return false.
 * @param url - The URL to validate.
 */
const expectUrlToBeInvalid = (url: string) => {
  expect(isValidUrl(url)).toBe(false);
};

describe('parseWidgetTypeFromUrl', () => {
  describe('Photo', () => {
    it('correctly parses photo URL', () => {
      expectParseToReturn(
        'https://storage.googleapis.com/example.jpg',
        'Photo'
      );
    });
  });

  describe('Substack', () => {
    it('correctly parses Substack article URL', () => {
      expectParseToReturn(
        'https://example.substack.com/p/heroes-who-came-to-look-for-example',
        'Substack'
      );
    });

    it('throws an error for unsupported Substack profile URL', () => {
      expectParseToThrow('https://example.substack.com');
    });
  });

  describe('Spotify', () => {
    it('correctly parses track URL', () => {
      expectParseToReturn(
        'https://open.spotify.com/track/51q75hNecOooZoFdON9GOh?si=0b7304623b454aa6',
        'SpotifySong'
      );
    });

    it('correctly parses album URL', () => {
      expectParseToReturn(
        'https://open.spotify.com/album/4OlJgjlpzzUDYqdhf3vVdD?si=o3udjAIHTZGZALcuSWNwbA',
        'SpotifyAlbum'
      );
    });

    it('throws an error for unsupported Spotify URL', () => {
      expectParseToThrow(
        'https://open.spotify.com/artist/5RPzPJCg4ER1LzQkorZ31p?si=O6VClbhzRyW3u28Mvec7JQ'
      );
    });
  });

  describe('Soundcloud', () => {
    it('correctly parses song URL', () => {
      expectParseToReturn(
        'https://soundcloud.com/nepado/stutter',
        'SoundcloudSong'
      );
    });

    it('correctly parses song URL with trailing slash', () => {
      expectParseToReturn(
        'https://soundcloud.com/nepado/stutter/',
        'SoundcloudSong'
      );
    });

    it('throws an error for unsupported short Soundcloud song link', () => {
      expectParseToThrow('https://on.soundcloud.com/VPFFZmvarbnm9er19');
    });

    it('throws an error for unsupported Soundcloud Profile', () => {
      expectParseToThrow('https://soundcloud.com/nepado');
    });

    it('throws an error for unsupported short Soundcloud Profile', () => {
      expectParseToThrow('https://on.soundcloud.com/ug2v9Ds9hQ89yKMX8');
    });

    it('throws an error for unsupported Soundcloud set', () => {
      expectParseToThrow(
        'https://soundcloud.com/nepado/sets/junkyard-mosaic-1'
      );
    });

    it('throws an error for unsupported short Soundcloud set', () => {
      expectParseToThrow('https://on.soundcloud.com/wnRvwh7r6kyj3oY46');
    });
  });

  describe('Instagram', () => {
    it('correctly parses profile URL', () => {
      expectParseToReturn(
        'https://www.instagram.com/mysorbet.xyz',
        'InstagramProfile'
      );
    });

    it('throws an error for unsupported Instagram post url', () => {
      expectParseToThrow('https://www.instagram.com/p/C5OKLHIoSiy/');
    });

    it('throws an error for unsupported Instagram story url', () => {
      expectParseToThrow(
        'https://www.instagram.com/stories/highlights/17965342688723373/'
      );
    });
  });

  describe('Twitter', () => {
    it('correctly parses profile URL', () => {
      expectParseToReturn('https://twitter.com/mysorbetxyz', 'TwitterProfile');
    });

    it('throws an error for unsupported Twitter URL', () => {
      expectParseToThrow(
        'https://x.com/mysorbetxyz/status/1792269032324038672'
      );
    });
  });

  describe('LinkedIn', () => {
    it('correctly parses profile URL', () => {
      expectParseToReturn(
        'https://www.linkedin.com/in/dilloncutaiar',
        'LinkedInProfile'
      );
    });

    it('throws an error for unsupported LinkedIn company profile', () => {
      expectParseToThrow('https://www.linkedin.com/company/mysorbet/posts');
    });

    it('throws an error for unsupported LinkedIn post', () => {
      expectParseToThrow(
        'https://www.linkedin.com/posts/mysorbet_exciting-news-were-onboarding-new-activity-7239256540170379264-TKz1'
      );
    });
  });

  describe('Youtube', () => {
    it('correctly parses YouTube link', () => {
      expectParseToReturn(
        'https://www.youtube.com/watch?v=myYU_Vujf0A',
        'Youtube'
      );
    });

    it('correctly parses YouTube short link', () => {
      expectParseToReturn('https://youtu.be/myYU_Vujf0A', 'Youtube');
    });

    it('throws an error for unsupported YouTube channel', () => {
      expectParseToThrow('https://www.youtube.com/@cutaiar');
    });

    it('throws an error for unsupported YouTube channel with more path segments', () => {
      expectParseToThrow('https://www.youtube.com/@cutaiar/featured');
    });

    it('throws an error for unsupported YouTube shorts', () => {
      expectParseToThrow('https://www.youtube.com/shorts/Zmx0Ou5TNJs');
    });
  });

  describe('Github', () => {
    it('correctly parses profile URL', () => {
      expectParseToReturn('https://github.com/cutaiar', 'Github');
    });

    it('correctly parses repository URL', () => {
      expectParseToReturn('https://github.com/username/repo', 'Github');
    });
  });

  describe('Dribbble', () => {
    it('correctly parses Dribbble shot URL', () => {
      expectParseToReturn(
        'https://dribbble.com/shots/1234567-title',
        'Dribbble'
      );
    });
  });

  describe('Behance', () => {
    it('correctly parses Behance project URL', () => {
      expectParseToReturn(
        'https://www.behance.net/gallery/1234567/Project-Title',
        'Behance'
      );
    });
  });

  describe('Medium', () => {
    it('correctly parses Medium article URL', () => {
      expectParseToReturn(
        'https://medium.com/@username/article-title',
        'Medium'
      );
    });
  });

  describe('Figma', () => {
    it('correctly parses Figma link', () => {
      expectParseToReturn(
        'https://www.figma.com/file/1234567/Design-File',
        'Figma'
      );
    });
  });

  describe('General Links', () => {
    it('correctly parses generic link', () => {
      expectParseToReturn('https://www.example.com', 'Link');
    });
  });

  it('throws an error for invalid URLs', () => {
    expectParseToThrow('invalid-url');
  });
});

describe('validateUrl', () => {
  it('returns true for valid URLs', () => {
    expectUrlToBeValid('https://www.example.com');
    expectUrlToBeValid('https://example.com');
    expectUrlToBeValid('https://subdomain.example.co.uk/path?query=param#hash');
  });

  it('returns true for urls without a protocol', () => {
    expectUrlToBeValid('www.example.com');
    expectUrlToBeValid('example.com');
    expectUrlToBeValid('subdomain.example.co.uk/path?query=param#hash');
  });

  it('returns true for silly urls', () => {
    expectUrlToBeValid('a.b');
    expectUrlToBeValid('a.b.c');
    expectUrlToBeValid('a.b/nothing');
  });

  it('returns true for URLs with IP addresses', () => {
    expectUrlToBeValid('http://192.168.0.1');
    expectUrlToBeValid('https://8.8.8.8');
  });

  it('returns true for URLs with ports', () => {
    expectUrlToBeValid('https://example.com:8080');
  });

  it('returns true for URLs with underscores in the domain', () => {
    expectUrlToBeValid('http://example_domain.com');
  });

  it('returns true for URLs with spaces and special characters', () => {
    expectUrlToBeValid('https://example. com');
    expectUrlToBeValid('https://exam ple.com');
    expectUrlToBeValid('https:// example.com');
    expectUrlToBeValid('https://example!.com');
  });

  it('returns false for URLs without a TLD', () => {
    expectUrlToBeInvalid('https://example');
    expectUrlToBeInvalid('http://localhost:3000');
    expectUrlToBeInvalid('http://localhost');
  });

  it('returns false for invalid URLs', () => {
    expectUrlToBeInvalid('not a url');
    expectUrlToBeInvalid('http://');
    expectUrlToBeInvalid('https://');
    expectUrlToBeInvalid('http://a');
    expectUrlToBeInvalid('http://a.');
    expectUrlToBeInvalid('google');
    expectUrlToBeInvalid('a.');
    expectUrlToBeInvalid('.');
  });

  it('returns false for urls with unsupported protocols', () => {
    expectUrlToBeInvalid('ftp://example.com');
    expectUrlToBeInvalid('mailto:example@example.com');
    expectUrlToBeInvalid('tel:1234567890');
    expectUrlToBeInvalid('irc://irc.example.com');
    expectUrlToBeInvalid('file://example.com');
    expectUrlToBeInvalid('sftp://example.com');
    expectUrlToBeInvalid('data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==');
    expectUrlToBeInvalid('ws://example.com');
    expectUrlToBeInvalid('wss://example.com');
    expectUrlToBeInvalid('magnet:?xt=urn:btih:example');
  });
});
