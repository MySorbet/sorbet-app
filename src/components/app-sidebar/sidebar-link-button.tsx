'use client';

import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { useRef } from 'react';

import { SidebarMenuButton, useSidebar } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

import { AnimatedIcon, isAnimatedIcon, SidebarIcon } from './sidebar-icon';

export type MenuItemProps = {
  title: string;
  url: string;
  icon: LucideIcon | AnimatedIcon;
  disabled?: boolean;
};

/** Sidebar menu button as a link with animated icon */
export const SidebarLinkButton = ({
  item,
  iconClassName,
}: {
  item: MenuItemProps;
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
        href={item.disabled ? '#' : item.url}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => isMobile && toggleSidebar()}
        className={cn(item.disabled && 'pointer-events-none opacity-50')}
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
