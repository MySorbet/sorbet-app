import { ChevronsUpDown, LucideIcon, User } from 'lucide-react';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { useAuth } from '@/hooks';
import { cn } from '@/lib/utils';

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
  // TODO: Use a a better hook and remove mock
  // const { smartWalletAddress } = useSmartWalletAddress();
  // const { usdcBalance } = useWalletBalances(smartWalletAddress, false);
  const { loading, usdcBalance } = useMockBalance();

  const item = {
    title: 'Wallet',
    url: '#/wallet',
    icon: WalletIcon,
  };
  return (
    <SidebarMenuItem key={item.title}>
      <SidebarLinkButton item={item} />

      <SidebarMenuBadge>
        {loading ? (
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
// TODO: useMobile to render a button to open and close the sidebar on mobile
/** A global sidebar */
export const AppSidebar = () => {
  // TODO: Props instead?
  const { user } = useAuth();

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
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <Avatar className='h-8 w-8 rounded-full'>
                <AvatarImage src={user?.profileImage} alt={user?.firstName} />
                <AvatarFallback className='text-muted-foreground size-8 rounded-full'>
                  <User />
                </AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold'>
                  {user?.firstName}
                </span>
                <span className='truncate text-xs'>{user?.email}</span>
              </div>
              <ChevronsUpDown className='ml-auto size-4' />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
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

const useMockBalance = () => {
  const [loading, setLoading] = useState(true);
  const [usdcBalance, setUsdcBalance] = useState<string>('1,329');
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      setUsdcBalance('1,329');
    }, 1000);
  }, []);
  return { loading, usdcBalance };
};
