import { getSocialIconForWidget } from '@/components/profile/widgets';
import { cn } from '@/lib/utils';
import { WidgetType } from '@/types';
import Image from 'next/image';

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
      className={cn('size-[30px] mb-4', className)} // TODO: Get rid of bottom margin
      src={getSocialIconForWidget(type)}
      alt={alt ?? 'Icon for widget'}
      width={30}
      height={30}
      {...rest}
    />
  );
};
