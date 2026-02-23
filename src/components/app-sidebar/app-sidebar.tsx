import Image from 'next/image';
import Link from 'next/link';

import { FeaturebaseLinkButton } from '@/components/app-sidebar/featurebase-link-button';
import { LinkInBioMenuItem } from '@/components/app-sidebar/link-in-bio-menu-item';
import { Badge } from '@/components/ui/badge';
import { FileTextIcon } from '@/components/ui/file-text';
import { HandCoinsIcon } from '@/components/ui/hand-coins';
import { LandmarkIcon } from '@/components/ui/landmark';
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
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { SquareGanttChartIcon } from '@/components/ui/square-gantt-chart';
import { UsersIcon } from '@/components/ui/users';
import { useIsVerified } from '@/hooks/profile/use-is-verified';
import { useAuth } from '@/hooks/use-auth';
import { useFlags } from '@/hooks/use-flags';
import { useWalletBalances } from '@/hooks/web3/use-wallet-balances';
import { cn } from '@/lib/utils';

import { NavUser } from './nav-user';
import { SidebarLinkButton } from './sidebar-link-button';

/** A global sidebar component for logged in users */
export const AppSidebar = () => {
  const { settings, recipients, accounts } = useFlags();
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
            <DashboardMenuItem />
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Payments */}
        <SidebarGroup>
          <SidebarGroupLabel>Payments</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarLinkButton
                  item={{
                    title: 'Invoices',
                    url: '/invoices',
                    icon: FileTextIcon,
                  }}
                />
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarLinkButton
                  item={{
                    title: 'Transactions',
                    url: '/wallet/all',
                    icon: HandCoinsIcon,
                  }}
                />
              </SidebarMenuItem>
              {recipients && (
                <SidebarMenuItem>
                  <SidebarLinkButton
                    item={{
                      title: 'Recipients',
                      url: '/recipients',
                      icon: UsersIcon,
                    }}
                  />
                  <SidebarMenuBadge></SidebarMenuBadge>
                </SidebarMenuItem>
              )}
              {accounts && (
                <SidebarMenuItem>
                  <SidebarLinkButton
                    item={{
                      title: 'Accounts',
                      url: '/accounts',
                      icon: LandmarkIcon,
                    }}
                  />
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Profile */}
        <SidebarGroup>
          <SidebarGroupLabel>Profile</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <LinkInBioMenuItem />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Account */}
        <SidebarGroup className='mt-auto'>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <VerifiedMenuItem />
              <SidebarMenuItem>
                <FeaturebaseLinkButton
                  item={{
                    title: 'Feedback',
                    icon: MessageSquareIcon,
                  }}
                />
              </SidebarMenuItem>
              {settings && (
                <SidebarMenuItem>
                  <SidebarLinkButton
                    item={{
                      title: 'Settings',
                      url: '/settings',
                      icon: SettingsIcon,
                    }}
                  />
                  <SidebarMenuBadge>
                    <Badge variant='outline'>🛠️</Badge>
                  </SidebarMenuBadge>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
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

/** Local dashboard menu item which displays the wallet balance */
const DashboardMenuItem = () => {
  const { baseUsdc, stellarUsdc, isLoading } = useWalletBalances();

  const base = Number(baseUsdc ?? 0);
  const stellar = Number(stellarUsdc ?? 0);
  const total =
    (Number.isFinite(base) ? base : 0) +
    (Number.isFinite(stellar) ? stellar : 0);
  const totalFormatted = total.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  const item = {
    title: 'Dashboard',
    url: '/dashboard',
    icon: SquareGanttChartIcon,
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem key={item.title}>
        <SidebarLinkButton item={item} />
        <SidebarMenuBadge>
          {isLoading ? (
            <Skeleton className='h-4 w-16' variant='darker' />
          ) : (
            <span className='animate-in fade-in-0 font-mono text-xs font-medium'>
              ${totalFormatted} USDC
            </span>
          )}
        </SidebarMenuBadge>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

/** Local verified menu item which has a dynamic title and icon depending on verification status */
const VerifiedMenuItem = () => {
  const isVerified = useIsVerified();
  const { user } = useAuth();
  const isBusiness = user?.customerType === 'business';
  const item = {
    title: isVerified
      ? 'Account verified'
      : isBusiness
      ? 'Verify your business'
      : 'Get verified',
    url: '/verify',
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
};
