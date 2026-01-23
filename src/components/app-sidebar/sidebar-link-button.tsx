'use client';

import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef } from 'react';

import { SidebarMenuButton, useSidebar } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

import {
  AnimatedIcon,
  AnimatedIconHandle,
  isAnimatedIcon,
  SidebarIcon,
} from './sidebar-icon';

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
  const iconRef = useRef<AnimatedIconHandle | null>(null);
  const pathname = usePathname();

  const handleMouseEnter = () => {
    if (iconRef.current && isAnimatedIcon(iconRef.current)) {
      iconRef.current.startAnimation();
    }
  };

  const handleMouseLeave = () => {
    if (iconRef.current && isAnimatedIcon(iconRef.current)) {
      iconRef.current.stopAnimation();
    }
  };

  const isMobile = useIsMobile();
  const { toggleSidebar } = useSidebar();

  // Check if current path matches the item URL
  const isActive = pathname === item.url || pathname?.startsWith(`${item.url}/`);

  return (
    <SidebarMenuButton asChild isActive={isActive}>
      <Link
        href={item.disabled ? '#' : item.url}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={(event) => {
          if (item.disabled) {
            event.preventDefault();
            return;
          }
          if (isMobile) {
            toggleSidebar();
          }
        }}
        className={cn(item.disabled && 'pointer-events-none opacity-50')}
        prefetch
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
