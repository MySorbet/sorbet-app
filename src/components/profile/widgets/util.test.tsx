import { isValidUrl, parseWidgetTypeFromUrl } from './util';

describe('parseWidgetTypeFromUrl', () => {
  describe('Photo', () => {
    it('correctly parses photo URL', () => {
      expect(
        parseWidgetTypeFromUrl('https://storage.googleapis.com/example.jpg')
      ).toBe('Photo');
    });
  });

  describe('Substack', () => {
    it('correctly parses Substack article URL', () => {
      expect(
        parseWidgetTypeFromUrl(
          'https://example.substack.com/p/heroes-who-came-to-look-for-example'
        )
      ).toBe('Substack');
    });

    it('throws an error for unsupported Substack profile URL', () => {
      expect(() =>
        parseWidgetTypeFromUrl('https://example.substack.com')
      ).toThrow();
    });
  });

  describe('Spotify', () => {
    it('correctly parses track URL', () => {
      expect(
        parseWidgetTypeFromUrl(
          'https://open.spotify.com/track/51q75hNecOooZoFdON9GOh?si=0b7304623b454aa6'
        )
      ).toBe('SpotifySong');
    });

    it('correctly parses album URL', () => {
      expect(
        parseWidgetTypeFromUrl(
          'https://open.spotify.com/album/4OlJgjlpzzUDYqdhf3vVdD?si=o3udjAIHTZGZALcuSWNwbA'
        )
      ).toBe('SpotifyAlbum');
    });

    it('throws an error for unsupported Spotify URL', () => {
      expect(() =>
        parseWidgetTypeFromUrl(
          'https://open.spotify.com/artist/5RPzPJCg4ER1LzQkorZ31p?si=O6VClbhzRyW3u28Mvec7JQ'
        )
      ).toThrow();
    });
  });

  describe('Soundcloud', () => {
    // Songs are supported
    it('correctly parses song URL', () => {
      expect(
        parseWidgetTypeFromUrl('https://soundcloud.com/nepado/stutter')
      ).toBe('SoundcloudSong');
    });

    it('correctly parses song URL with trailing slash', () => {
      expect(
        parseWidgetTypeFromUrl('https://soundcloud.com/nepado/stutter/')
      ).toBe('SoundcloudSong');
    });

    // Unfortunately, short URLs are not supported since there is no way to tell them apart
    it('throws an error for unsupported short Soundcloud song link', () => {
      expect(() =>
        parseWidgetTypeFromUrl('https://on.soundcloud.com/VPFFZmvarbnm9er19')
      ).toThrow();
    });

    // Profiles are not supported
    it('throws an error for unsupported Soundcloud Profile', () => {
      expect(() =>
        parseWidgetTypeFromUrl('https://soundcloud.com/nepado')
      ).toThrow();
    });

    it('throws an error for unsupported short Soundcloud Profile', () => {
      expect(() =>
        parseWidgetTypeFromUrl('https://on.soundcloud.com/ug2v9Ds9hQ89yKMX8')
      ).toThrow();
    });

    // Playlist and albums (sets) are not
    it('throws an error for unsupported Soundcloud set', () => {
      expect(() =>
        parseWidgetTypeFromUrl(
          'https://soundcloud.com/nepado/sets/junkyard-mosaic-1'
        )
      ).toThrow();
    });

    it('throws an error for unsupported short Soundcloud set', () => {
      expect(() =>
        parseWidgetTypeFromUrl('https://on.soundcloud.com/wnRvwh7r6kyj3oY46')
      ).toThrow();
    });
  });

  describe('Instagram', () => {
    it('correctly parses profile URL', () => {
      expect(
        parseWidgetTypeFromUrl('https://www.instagram.com/mysorbet.xyz')
      ).toBe('InstagramProfile');
    });

    it('throws an error for unsupported Instagram post url', () => {
      expect(() =>
        parseWidgetTypeFromUrl('https://www.instagram.com/p/C5OKLHIoSiy/')
      ).toThrow();
      // TODO: This will be supported toBe('InstagramPost');
    });

    it('throws an error for unsupported Instagram story url', () => {
      expect(() =>
        parseWidgetTypeFromUrl(
          'https://www.instagram.com/stories/highlights/17965342688723373/'
        )
      ).toThrow();
    });
  });

  describe('Twitter', () => {
    it('correctly parses profile URL', () => {
      expect(parseWidgetTypeFromUrl('https://twitter.com/mysorbetxyz')).toBe(
        'TwitterProfile'
      );
    });

    it('throws an error for unsupported Twitter URL', () => {
      expect(() =>
        parseWidgetTypeFromUrl(
          'https://x.com/mysorbetxyz/status/1792269032324038672'
        )
      ).toThrow();
    });
  });

  describe('LinkedIn', () => {
    it('correctly parses profile URL', () => {
      expect(
        parseWidgetTypeFromUrl('https://www.linkedin.com/in/dilloncutaiar')
      ).toBe('LinkedInProfile');
    });

    it('throws an error for unsupported LinkedIn company profile', () => {
      expect(() =>
        parseWidgetTypeFromUrl(
          'https://www.linkedin.com/company/mysorbet/posts'
        )
      ).toThrow();
    });

    it('throws an error for unsupported LinkedIn post', () => {
      expect(() =>
        parseWidgetTypeFromUrl(
          'https://www.linkedin.com/posts/mysorbet_exciting-news-were-onboarding-new-activity-7239256540170379264-TKz1'
        )
      ).toThrow();
    });
  });

  describe('Youtube', () => {
    // Support video links
    it('correctly parses YouTube link', () => {
      expect(
        parseWidgetTypeFromUrl('https://www.youtube.com/watch?v=myYU_Vujf0A')
      ).toBe('Youtube');
    });

    // And their short versions
    it('correctly parses YouTube short link', () => {
      expect(parseWidgetTypeFromUrl('https://youtu.be/myYU_Vujf0A')).toBe(
        'Youtube'
      );
    });

    // No channels
    it('throws an error for unsupported YouTube channel', () => {
      expect(() =>
        parseWidgetTypeFromUrl('https://www.youtube.com/@cutaiar')
      ).toThrow('Youtube channels are not supported');
    });

    // Even with more path segments
    it('throws an error for unsupported YouTube channel', () => {
      expect(() =>
        parseWidgetTypeFromUrl('https://www.youtube.com/@cutaiar/featured')
      ).toThrow('Youtube channels are not supported');
    });

    // No shorts
    it('throws an error for unsupported YouTube shorts', () => {
      expect(() =>
        parseWidgetTypeFromUrl('https://www.youtube.com/shorts/Zmx0Ou5TNJs')
      ).toThrow('Youtube shorts are not supported');
    });
  });

  describe('Github', () => {
    it('correctly parses profile URL', () => {
      expect(parseWidgetTypeFromUrl('https://github.com/cutaiar')).toBe(
        'Github'
      );
    });

    it('correctly parses repository URL', () => {
      expect(parseWidgetTypeFromUrl('https://github.com/username/repo')).toBe(
        'Github'
      );
    });
  });

  describe('Dribbble', () => {
    it('correctly parses Dribbble shot URL', () => {
      expect(
        parseWidgetTypeFromUrl('https://dribbble.com/shots/1234567-title')
      ).toBe('Dribbble');
    });
  });

  describe('Behance', () => {
    it('correctly parses Behance project URL', () => {
      expect(
        parseWidgetTypeFromUrl(
          'https://www.behance.net/gallery/1234567/Project-Title'
        )
      ).toBe('Behance');
    });
  });

  describe('Medium', () => {
    it('correctly parses Medium article URL', () => {
      expect(
        parseWidgetTypeFromUrl('https://medium.com/@username/article-title')
      ).toBe('Medium');
    });
  });

  describe('Figma', () => {
    it('correctly parses Figma link', () => {
      expect(
        parseWidgetTypeFromUrl('https://www.figma.com/file/1234567/Design-File')
      ).toBe('Figma');
    });
  });

  describe('General Links', () => {
    it('correctly parses generic link', () => {
      expect(parseWidgetTypeFromUrl('https://www.example.com')).toBe('Link');
    });
  });

  it('throws an error for invalid URLs', () => {
    expect(() => parseWidgetTypeFromUrl('invalid-url')).toThrow();
  });
});

describe('validateUrl', () => {
  it('returns true for valid URLs', () => {
    expect(isValidUrl('https://www.example.com')).toBe(true);
    expect(isValidUrl('https://example.com')).toBe(true);
    expect(
      isValidUrl('https://subdomain.example.co.uk/path?query=param#hash')
    ).toBe(true);
  });

  it('returns true urls without a protocol', () => {
    expect(isValidUrl('www.example.com')).toBe(true);
    expect(isValidUrl('example.com')).toBe(true);
    expect(isValidUrl('subdomain.example.co.uk/path?query=param#hash')).toBe(
      true
    );
  });

  it('returns true for silly urls', () => {
    expect(isValidUrl('a.b')).toBe(true);
    expect(isValidUrl('a.b.c')).toBe(true);
    expect(isValidUrl('a.b/nothing')).toBe(true);
  });

  it('returns true for URLs with IP addresses', () => {
    expect(isValidUrl('http://192.168.0.1')).toBe(true);
    expect(isValidUrl('https://8.8.8.8')).toBe(true);
  });

  it('returns true for URLs with ports', () => {
    expect(isValidUrl('https://example.com:8080')).toBe(true);
  });

  it('returns true for URLs with underscores in the domain', () => {
    expect(isValidUrl('http://example_domain.com')).toBe(true);
  });

  it('returns true for URLs with spaces and special characters', () => {
    expect(isValidUrl('https://example. com')).toBe(true);
    expect(isValidUrl('https://exam ple.com')).toBe(true);
    expect(isValidUrl('https:// example.com')).toBe(true);
    expect(isValidUrl('https://example!.com')).toBe(true);
  });

  it('returns false for URLs without a TLD', () => {
    expect(isValidUrl('https://example')).toBe(false);
    expect(isValidUrl('http://localhost:3000')).toBe(false);
  });

  it('returns false for invalid URLs', () => {
    expect(isValidUrl('not a url')).toBe(false);
    expect(isValidUrl('http://')).toBe(false);
    expect(isValidUrl('https://')).toBe(false);
    expect(isValidUrl('google')).toBe(false);
    expect(isValidUrl('a.')).toBe(false);
    expect(isValidUrl('.')).toBe(false);
  });

  it('returns false for urls with unsupported protocols', () => {
    expect(isValidUrl('ftp://example.com')).toBe(false);
    expect(isValidUrl('mailto:example@example.com')).toBe(false);
    expect(isValidUrl('tel:1234567890')).toBe(false);
    expect(isValidUrl('irc://irc.example.com')).toBe(false);
    expect(isValidUrl('file://example.com')).toBe(false);
    expect(isValidUrl('sftp://example.com')).toBe(false);
    expect(isValidUrl('data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==')).toBe(
      false
    );
    expect(isValidUrl('ws://example.com')).toBe(false);
    expect(isValidUrl('wss://example.com')).toBe(false);
    expect(isValidUrl('magnet:?xt=urn:btih:example')).toBe(false);
  });
});
