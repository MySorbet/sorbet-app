import { Meta, StoryFn, StoryObj } from '@storybook/react';

import { WidgetType, WidgetTypes } from './util';
import { Widget } from './widget';

const meta = {
  title: 'Profile/v2/Widget',
  component: Widget,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story: StoryFn) => (
      <div className='h-fit'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Widget>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Helper to create a container with specific dimensions */
const createSizeContainer = (width: number, height: number) => {
  return (Story: StoryFn) => (
    <div className={`h-[${height}px] w-[${width}px]`}>
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

export const Default: Story = {
  decorators: [createSizeContainer(sizeConfigs.A.width, sizeConfigs.A.height)],
  args: {
    title: 'Widget',
    href: 'https://www.google.com',
    size: 'A',
  },
};

export const A: Story = {
  decorators: [createSizeContainer(sizeConfigs.A.width, sizeConfigs.A.height)],
  args: {
    ...Default.args,
    size: 'A',
  },
};

export const B: Story = {
  decorators: [createSizeContainer(sizeConfigs.B.width, sizeConfigs.B.height)],
  args: {
    ...Default.args,
    size: 'B',
  },
};

export const C: Story = {
  decorators: [createSizeContainer(sizeConfigs.C.width, sizeConfigs.C.height)],
  args: {
    ...Default.args,
    size: 'C',
  },
};

export const D: Story = {
  decorators: [createSizeContainer(sizeConfigs.D.width, sizeConfigs.D.height)],
  args: {
    ...Default.args,
    size: 'D',
  },
};

export const WithIcon: Story = {
  decorators: [createSizeContainer(sizeConfigs.A.width, sizeConfigs.A.height)],
  args: {
    ...Default.args,
    iconUrl:
      'https://storage.googleapis.com/bkt-ph-prod-homepage-static-public/img/favicon.d8b7874261c3.ico',
    contentUrl:
      'https://creatorspace.imgix.net/sites/ogimages/aHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL2xleWVfYnVja2V0L3dwLWNvbnRlbnQvdXBsb2Fkcy80NWZhOGY0MS10b21hdG8tbW96ejItMjAyMDA4MTlfbGV5ZV9iLXNxdWFyZS1waXp6YS0yNTUtNzUuanBn.jpeg?width=600&height=600',
  },
};

export const Loading: Story = {
  decorators: [createSizeContainer(sizeConfigs.A.width, sizeConfigs.A.height)],
  args: {
    ...Default.args,
    loading: true,
  },
};

/** Example URLs for each widget type based on test cases */
const widgetTypeUrls: Record<WidgetType, string> = {
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
} as const;

// Demonstrate that widgets render first class icons if they have a supported url
export const AllFirstClassWidgets: Story = {
  args: {
    ...Default.args,
  },
  render: () => {
    return (
      <div className='flex flex-wrap gap-4'>
        {WidgetTypes.map((type) => (
          <div key={type} className='size-[175px]'>
            <Widget
              {...Default.args}
              href={widgetTypeUrls[type] || Default.args.href}
              title={type}
              size='B'
            />
          </div>
        ))}
      </div>
    );
  },
};
