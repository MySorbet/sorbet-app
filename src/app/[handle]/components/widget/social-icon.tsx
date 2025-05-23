import { cn } from '@/lib/utils';
import behance from '~/svg/social/behance.svg';
import discord from '~/svg/social/discord.svg';
import dribbble from '~/svg/social/dribbble.svg';
import farcaster from '~/svg/social/farcaster.svg';
import figma from '~/svg/social/figma.svg';
import github from '~/svg/social/github.svg';
import instagram from '~/svg/social/instagram.svg';
import linkedin from '~/svg/social/linkedin.svg';
import medium from '~/svg/social/medium.svg';
import soundcloud from '~/svg/social/soundcloud.svg';
import spotify from '~/svg/social/spotify.svg';
import substack from '~/svg/social/substack.svg';
import twitter from '~/svg/social/twitter.svg';
import youtube from '~/svg/social/youtube.svg';
import zora from '~/svg/social/zora.svg';

import { UrlType } from '../../util';

interface SocialIconProps extends React.SVGProps<SVGSVGElement> {
  /** The type of icon to render. */
  type: UrlType;
  /** Optional className for the icon. */
  className?: string;
}

/**
 * Renders the the appropriate social icon for a given url `type`.
 */
export const SocialIcon: React.FC<SocialIconProps> = ({
  type,
  className,
  ...rest
}) => {
  const Icon = iconByUrlType[type];
  return <Icon className={cn('size-10 shrink-0', className)} {...rest} />;
};

const iconByUrlType: Record<
  UrlType,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  Substack: substack,
  SpotifySong: spotify,
  SpotifyAlbum: spotify,
  SoundcloudSong: soundcloud,
  InstagramPost: instagram,
  InstagramProfile: instagram,
  TwitterProfile: twitter,
  LinkedInProfile: linkedin,
  Youtube: youtube,
  Github: github,
  Dribbble: dribbble,
  Behance: behance,
  Medium: medium,
  Figma: figma,
  FigmaDesign: figma,
  DribbbleProfile: dribbble,
  YoutubeShorts: youtube,
  YoutubeChannel: youtube,
  TwitterPost: twitter,
  SubstackPost: substack,
  Soundcloud: soundcloud,
  SoundcloudPlaylistAlbum: soundcloud,
  SoundcloudShortLink: soundcloud,
  InstagramStory: instagram,
  LinkedInPost: linkedin,
  LinkedInCompany: linkedin,
  Spotify: spotify,
  Farcaster: farcaster,
  Zora: zora, // TODO: Zora icon is just an embedded image, perhaps we should just use an image.
  Discord: discord,
};
