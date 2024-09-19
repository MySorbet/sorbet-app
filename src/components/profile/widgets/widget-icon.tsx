import Image from 'next/image';

import { cn } from '@/lib/utils';
import { WidgetType, WidgetTypes } from '@/types';

/**
 * This type allows you to passthrough any prop that a Next `<Image/>` takes save for `src` which is handled by the `type` prop.
 */
interface WidgetIconProps
  extends Omit<React.ComponentProps<typeof Image>, 'src' | 'alt'> {
  /** The type of widget icon to render. */
  type: WidgetTypeWithIcon;
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

/** This is the subset of `WidgetType`'s that have an associated social icon. */
export type WidgetTypeWithIcon = Exclude<WidgetType, 'Photo' | 'Link'>;

/** This is the subset of `WidgetType`'s that have an associated social icon (as an array) */
export const WidgetTypesWithIcons: WidgetTypeWithIcon[] = WidgetTypes.filter(
  (type) => {
    return type !== 'Photo' && type !== 'Link';
  }
);

/**
 * Maps widget type to social icon.
 *
 * @param widgetType - The type of the widget.
 * @returns The path to the social icon image to be used as `src`
 */
export const getSocialIconForWidget = (
  widgetType: WidgetTypeWithIcon
): string => {
  const iconMap: Record<WidgetTypeWithIcon, string> = {
    Substack: 'substack.svg',
    SpotifySong: 'spotify.svg',
    SpotifyAlbum: 'spotify.svg',
    SoundcloudSong: 'soundCloud.svg',
    InstagramPost: 'instagram.svg',
    InstagramProfile: 'instagram.svg',
    TwitterProfile: 'twitter.svg',
    LinkedInProfile: 'linkedin.svg',
    Youtube: 'youtube.svg',
    Github: 'github.svg',
    Dribbble: 'dribbble.svg',
    Behance: 'behance.svg',
    Medium: 'medium.svg',
    Figma: 'figma.svg',
  };

  return `/images/social/${iconMap[widgetType]}`;
};
