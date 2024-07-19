import { getSocialIconForWidget } from '@/components/profile/widgets';
import { cn } from '@/lib/utils';
import { WidgetType } from '@/types';
import Image from 'next/image';

/**
 * This type allows you to passthrough any prop that a Next `<Image/>` takes
 * except for `src` and `alt` which are handled by this component.
 */
interface WidgetIconProps
  extends Omit<React.ComponentProps<typeof Image>, 'src' | 'alt'> {
  /** The type of widget icon to render */
  type: WidgetType;
}

/**
 * Renders the the appropriate social icon for a given widget type with a NextJS `<Image/>`.
 * You may pass any prop that a Next `<Image/>` takes except for `src` and `alt`.
 */
export const WidgetIcon: React.FC<WidgetIconProps> = ({
  type,
  className,
  ...rest
}) => {
  return (
    <Image
      className={cn('mb-4', className)}
      src={getSocialIconForWidget(type)}
      alt={type}
      width={30}
      height={30}
      {...rest}
    />
  );
};
