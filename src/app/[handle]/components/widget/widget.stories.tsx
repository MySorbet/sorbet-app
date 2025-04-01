import { Meta, StoryFn, StoryObj } from '@storybook/react';

import { UrlType, UrlTypes } from './url-util';
import { Widget } from './widget';

/** Helper to create a container based on size prop */
const withSizeContainer = (Story: StoryFn, { args }: { args: any }) => {
  const config = sizeConfigs[args.size as keyof typeof sizeConfigs];
  return (
    <div style={{ height: `${config.height}px`, width: `${config.width}px` }}>
      <Story />
    </div>
  );
};

const sizeConfigs = {
  A: { width: 390, height: 390 },
  B: { width: 175, height: 175 },
  C: { width: 175, height: 390 },
  D: { width: 390, height: 175 },
} as const;

const urls = {
  iconUrl:
    'https://framerusercontent.com/images/vwqrWsyZbAoCnp6U2GM5Z4ncjwo.png',
  contentUrl:
    'https://framerusercontent.com/images/Ioch6MVHUWTPL65cNPDslY2ZMrs.png',
};

const meta = {
  title: 'Profile/Widget',
  component: Widget,
  parameters: {
    layout: 'centered',
  },
  decorators: [withSizeContainer],
} satisfies Meta<typeof Widget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Widget',
    href: 'https://www.google.com',
    size: 'A',
    editable: true,
  },
};

export const A: Story = {
  args: {
    ...Default.args,
    size: 'A',
  },
};

export const B: Story = {
  args: {
    ...Default.args,
    size: 'B',
  },
};

export const C: Story = {
  args: {
    ...Default.args,
    size: 'C',
  },
};

export const D: Story = {
  args: {
    ...Default.args,
    size: 'D',
  },
};

export const WithIcon: Story = {
  args: {
    ...Default.args,
    ...urls,
  },
};

export const WithIconAndLongTitle: Story = {
  args: {
    ...Default.args,
    ...urls,
    title:
      'This is a long title that will wrap. This is a long title that will wrap. This is a long title that will wrap. This is a long title that will wrap. This is a long title that will wrap. This is a long title that will wrap. This is a long title that will wrap. This is a long title that will wrap.',
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    loading: true,
  },
};

export const Public: Story = {
  args: {
    ...Default.args,
    editable: false,
    showPlaceholder: false,
  },
};

export const Image: Story = {
  args: {
    ...Default.args,
    type: 'image',
    href: undefined,
    contentUrl: urls.contentUrl,
  },
};

export const ImageWithLink: Story = {
  args: {
    ...Default.args,
    type: 'image',
    ...urls,
  },
};

/** Example URLs for each widget type based on test cases */
const urlsByType: Record<UrlType, string> = {
  Substack:
    'https://example.substack.com/p/heroes-who-came-to-look-for-example',
  SpotifySong:
    'https://open.spotify.com/track/51q75hNecOooZoFdON9GOh?si=0b7304623b454aa6',
  SpotifyAlbum:
    'https://open.spotify.com/album/4OlJgjlpzzUDYqdhf3vVdD?si=o3udjAIHTZGZALcuSWNwbA',
  SoundcloudSong: 'https://soundcloud.com/nepado/stutter',
  InstagramProfile: 'https://www.instagram.com/mysorbet.xyz',
  TwitterProfile: 'https://twitter.com/mysorbetxyz',
  LinkedInProfile: 'https://www.linkedin.com/in/dilloncutaiar',
  Youtube: 'https://www.youtube.com/watch?v=myYU_Vujf0A',
  Github: 'https://github.com/MySorbet',
  Dribbble: 'https://dribbble.com/shots/24550798-A-Grainy-Gradient',
  Behance: 'https://www.behance.net/gallery/208139325/A-Grainy-Gradient',
  Medium:
    'https://medium.com/@mysorbet/client-compatibility-check-spotting-bad-clients-and-finding-the-best-ones-c49ac047ad05',
  Figma: 'https://www.figma.com/design/1234567890/My-Design?node-id=1234567890',
  InstagramPost: 'https://www.instagram.com/p/C49ac047ad05/',
  FigmaDesign:
    'https://www.figma.com/design/1234567890/My-Design?node-id=1234567890',
  DribbbleProfile: 'https://dribbble.com/mysorbet',
  YoutubeShorts: 'https://www.youtube.com/shorts/1234567890',
  YoutubeChannel: 'https://www.youtube.com/@mysorbet',
  TwitterPost: 'https://x.com/mysorbetxyz/status/1234567890',
  SubstackPost:
    'https://example.substack.com/p/heroes-who-came-to-look-for-example',
  Soundcloud: 'https://soundcloud.com/nepado/stutter',
  SoundcloudPlaylistAlbum: 'https://soundcloud.com/nepado/sets/stutter',
  SoundcloudShortLink: 'https://soundcloud.com/nepado/stutter',
  InstagramStory: 'https://www.instagram.com/stories/highlights/1234567890/',
  LinkedInPost:
    'https://www.linkedin.com/posts/mysorbet_my-sorbet-is-a-platform-for-creators-to-build-and-share-activity-7111111111111111111/',
  LinkedInCompany: 'https://www.linkedin.com/company/mysorbet',
  Spotify:
    'https://open.spotify.com/album/4OlJgjlpzzUDYqdhf3vVdD?si=o3udjAIHTZGZALcuSWNwbA',
  Farcaster: 'https://warpcast.com/mysorbet',
  Zora: 'https://zora.co/collect/0x1234567890123456789012345678901234567890',
  Discord: 'http://discordapp.com/users/918450985624559626',
} as const;

// Demonstrate that widgets render first class icons if they have a supported url
export const AllFirstClassWidgets: Story = {
  args: {
    ...Default.args,
  },
  render: () => {
    return (
      <div className='absolute left-0 top-0 flex h-screen w-screen flex-wrap gap-4 p-4'>
        {UrlTypes.map((type) => (
          <div key={type} className='size-[175px]'>
            <Widget
              {...Default.args}
              href={urlsByType[type] || Default.args.href}
              title={type}
              size='B'
            />
          </div>
        ))}
      </div>
    );
  },
};
