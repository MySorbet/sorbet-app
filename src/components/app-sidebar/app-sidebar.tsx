import { LucideIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ForwardRefExoticComponent,
  HTMLAttributes,
  RefAttributes,
  useEffect,
  useRef,
  useState,
} from 'react';

import { ArrowLeftRightIcon } from '@/components/ui/arrow-left-right';
import { ChartColumnIncreasingIcon } from '@/components/ui/chart-column-increasing';
import { FileTextIcon } from '@/components/ui/file-text';
import { HandCoinsIcon } from '@/components/ui/hand-coins';
import { MessageSquareIcon } from '@/components/ui/message-square';
import { SettingsIcon } from '@/components/ui/settings';
import { ShieldCheckIcon } from '@/components/ui/shield-check';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { SquareGanttChartIcon } from '@/components/ui/square-gantt-chart';
import { SquareUserIcon } from '@/components/ui/square-user';
import { WalletIcon } from '@/components/ui/wallet';
import { useWalletBalance } from '@/hooks/web3/use-wallet-balance';
import { cn } from '@/lib/utils';

import { NavUser } from './nav-user';

// Little hack (assumes all icons are this type)
type AnimatedIconHandle = {
  startAnimation: () => void;
  stopAnimation: () => void;
};

type AnimatedIcon = ForwardRefExoticComponent<
  HTMLAttributes<HTMLDivElement> & RefAttributes<AnimatedIconHandle>
>;

type MenuItemProps = {
  title: string;
  url: string;
  icon: LucideIcon | AnimatedIcon;
};
type MenuItemRender = {
  render: () => React.ReactNode;
};

type MenuItem = MenuItemProps | MenuItemRender;

const isRender = (item: MenuItem): item is MenuItemRender => {
  return 'render' in item;
};

/** Dynamics wallet menu item which fetches and displays balance */
const WalletMenuItem = () => {
  const { data: usdcBalance, isLoading } = useWalletBalance();

  const item = {
    title: 'Wallet',
    url: '#/wallet',
    icon: WalletIcon,
  };
  return (
    <SidebarMenuItem key={item.title}>
      <SidebarLinkButton item={item} />

      <SidebarMenuBadge>
        {isLoading ? (
          <Skeleton className='h-4 w-16' variant='darker' />
        ) : (
          <span className='animate-in fade-in-0'>${usdcBalance} USDC</span>
        )}
      </SidebarMenuBadge>
    </SidebarMenuItem>
  );
};

// Menu items.
const items: MenuItem[] = [
  {
    title: 'Invoices',
    url: '#/invoices',
    icon: FileTextIcon,
  },
  {
    render: WalletMenuItem,
  },
  {
    title: 'Transactions',
    url: '#/wallet/all',
    icon: HandCoinsIcon,
  },
  {
    title: 'Transfers',
    url: '#/wallet',
    icon: ArrowLeftRightIcon,
  },
];

const profileItems: MenuItem[] = [
  {
    title: 'Link-in-bio',
    url: '#/wallet/all',
    icon: SquareUserIcon,
  },
  {
    title: 'Analytics',
    url: '#/wallet',
    icon: ChartColumnIncreasingIcon,
  },
];

const accountItems: MenuItem[] = [
  {
    render: () => {
      // TODO: dynamic verification status
      const isVerified = false;
      const item = {
        title: isVerified ? 'Account verified' : 'Get verified',
        url: '#/verify',
        icon: ShieldCheckIcon,
      };
      return (
        <SidebarMenuItem key={item.title}>
          <SidebarLinkButton
            item={item}
            iconClassName={cn(isVerified && 'text-green-500')}
          />
        </SidebarMenuItem>
      );
    },
  },
  {
    title: 'Feedback',
    url: '#/feedback',
    icon: MessageSquareIcon,
    // TODO: Opens featurebase modal
  },
  {
    title: 'Settings',
    url: '#/settings',
    icon: SettingsIcon,
  },
];

/** A global sidebar */
export const AppSidebar = () => {
  return (
    <Sidebar>
      {/* Header */}
      <SidebarHeader className='w-fit p-3'>
        <Link href='/'>
          <Image
            src='/svg/logo.svg'
            width={32}
            height={32}
            className='size-8'
            alt='Sorbet logo'
            priority
          />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {/* Dashboard */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarLinkButton
              item={{
                title: 'Dashboard',
                url: '#/dashboard',
                icon: SquareGanttChartIcon,
              }}
            />
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Payments */}
        <SidebarGroup>
          <SidebarGroupLabel>Payments</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderMenuItems(items)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Profile */}
        <SidebarGroup>
          <SidebarGroupLabel>Profile</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderMenuItems(profileItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Account */}
        <SidebarGroup className='mt-auto'>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderMenuItems(accountItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
};

const isAnimatedIcon = (
  icon: LucideIcon | AnimatedIconHandle
): icon is AnimatedIconHandle => {
  return 'startAnimation' in icon && 'stopAnimation' in icon;
};

const SidebarLinkButton = ({
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

const renderMenuItems = (items: MenuItem[]) => {
  return items.map((item) => {
    if (isRender(item)) {
      return item.render();
    }
    return (
      <SidebarMenuItem key={item.title}>
        <SidebarLinkButton item={item} />
      </SidebarMenuItem>
    );
  });
};
