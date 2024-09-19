import Image from 'next/image';

import { cn } from '@/lib/utils';
import { WidgetType } from '@/types';

/**
 * This type allows you to passthrough any prop that a Next `<Image/>` takes save for `src` which is handled by the `type` prop.
 */
interface WidgetIconProps
  extends Omit<React.ComponentProps<typeof Image>, 'src' | 'alt'> {
  /** The type of widget icon to render. */
  type: WidgetType;
  /** Optional alt for the image. If undefined, a generic default will be used */
  alt?: string;
}

/**
 * Renders the the appropriate social icon for a given widget `type` with a NextJS `<Image/>`.
 * - You may pass thru any prop that a Next `<Image/>` takes.
 */
export const WidgetIcon: React.FC<WidgetIconProps> = ({
  type,
  className,
  alt,
  ...rest
}) => {
  return (
    <Image
      className={cn('mb-4 size-[30px]', className)} // TODO: Get rid of bottom margin
      src={getSocialIconForWidget(type)}
      alt={alt ?? 'Icon for widget'}
      width={30}
      height={30}
      {...rest}
    />
  );
};

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
