'use client';

import Link from 'next/link';
import { useRef } from 'react';

import { SidebarMenuButton, useSidebar } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

import type { MenuItemProps } from './app-sidebar';
import { isAnimatedIcon, SidebarIcon } from './sidebar-icon';

/** Sidebar menu button as a link with animated icon */
export const SidebarLinkButton = ({
  item,
  iconClassName,
}: {
  item: Required<MenuItemProps>;
  iconClassName?: string;
}) => {
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

  const isMobile = useIsMobile();
  const { toggleSidebar } = useSidebar();

  return (
    <SidebarMenuButton asChild>
      <Link
        href={item.url}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => isMobile && toggleSidebar()}
      >
        <SidebarIcon
          iconRef={iconRef}
          Icon={item.icon}
          className={iconClassName}
        />
        <span>{item.title}</span>
      </Link>
    </SidebarMenuButton>
  );
};
