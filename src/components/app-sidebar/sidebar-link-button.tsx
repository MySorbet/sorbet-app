'use client';

import { type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { useRef } from 'react';

import { SidebarMenuButton } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

import type { AnimatedIconHandle, MenuItemProps } from './app-sidebar';

const isAnimatedIcon = (
  icon: LucideIcon | AnimatedIconHandle
): icon is AnimatedIconHandle => {
  return 'startAnimation' in icon && 'stopAnimation' in icon;
};

export const SidebarLinkButton = ({
  item,
  iconClassName,
}: {
  item: MenuItemProps;
  iconClassName?: string;
}) => {
  const Icon = item.icon;
  // TODO: fix this typing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const iconRef = useRef<any>(null);

  const handleMouseEnter = () => {
    if (iconRef.current && isAnimatedIcon(iconRef.current)) {
      iconRef.current?.startAnimation?.();
    }
  };

  const handleMouseLeave = () => {
    if (iconRef.current && isAnimatedIcon(iconRef.current)) {
      iconRef.current?.stopAnimation?.();
    }
  };

  return (
    <SidebarMenuButton asChild>
      <Link
        href={item.url}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Icon
          className={cn(
            iconClassName,
            'size-4 [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:stroke-current [&>svg]:stroke-[1.5]'
          )}
          size={20}
          strokeWidth={1.5}
          ref={iconRef}
        />
        <span>{item.title}</span>
      </Link>
    </SidebarMenuButton>
  );
};
