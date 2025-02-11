import { LucideIcon } from 'lucide-react';
import {
  ForwardRefExoticComponent,
  HTMLAttributes,
  RefAttributes,
  RefObject,
} from 'react';

import { cn } from '@/lib/utils';

export const isAnimatedIcon = (
  icon: LucideIcon | AnimatedIconHandle
): icon is AnimatedIconHandle => {
  return 'startAnimation' in icon && 'stopAnimation' in icon;
};

// Little hack (assumes all icons are this type)
export type AnimatedIconHandle = {
  startAnimation: () => void;
  stopAnimation: () => void;
};

export type AnimatedIcon = ForwardRefExoticComponent<
  HTMLAttributes<HTMLDivElement> & RefAttributes<AnimatedIconHandle>
>;

/** Either an animated or Lucide icon */
export const SidebarIcon = ({
  className,
  iconRef,
  Icon,
}: {
  className?: string;
  iconRef: RefObject<any>;
  Icon: LucideIcon | AnimatedIcon;
}) => {
  return (
    <Icon
      className={cn(
        className,
        'size-4 [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:stroke-current [&>svg]:stroke-[1.5]'
      )}
      size={20}
      strokeWidth={1.5}
      ref={iconRef}
    />
  );
};
