import {
  ArrowLeftRight,
  BarChartBig,
  ChevronsUpDown,
  FileText,
  HandCoins,
  LucideIcon,
  MessageSquare,
  Settings2,
  ShieldCheck,
  SquareGanttChart,
  SquareUser,
  User,
  Wallet,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { useAuth } from '@/hooks';
import { cn } from '@/lib/utils';

type MenuItemProps = {
  title: string;
  url: string;
  icon: LucideIcon;
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
    icon: Wallet,
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
    icon: FileText,
  },
  {
    render: WalletMenuItem,
  },
  {
    title: 'Transactions',
    url: '#/wallet/all',
    icon: HandCoins,
  },
  {
    title: 'Transfers',
    url: '#/wallet',
    icon: ArrowLeftRight,
  },
];

const profileItems: MenuItem[] = [
  {
    title: 'Link-in-bio',
    url: '#/wallet/all',
    icon: SquareUser,
  },
  {
    title: 'Analytics',
    url: '#/wallet',
    icon: BarChartBig,
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
        icon: ShieldCheck,
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
    icon: MessageSquare,
    // TODO: Opens featurebase modal
  },
  {
    title: 'Settings',
    url: '#/settings',
    icon: Settings2,
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
                icon: SquareGanttChart,
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
              <Avatar className='h-8 w-8 rounded-lg'>
                <AvatarImage src={user?.profileImage} alt={user?.firstName} />
                <AvatarFallback className='text-muted-foreground size-8 rounded-lg'>
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

const SidebarLinkButton = ({
  item,
  iconClassName,
}: {
  item: MenuItemProps;
  iconClassName?: string;
}) => {
  const Icon = item.icon;
  return (
    <SidebarMenuButton asChild>
      <a href={item.url}>
        <Icon className={iconClassName} />
        <span>{item.title}</span>
      </a>
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
