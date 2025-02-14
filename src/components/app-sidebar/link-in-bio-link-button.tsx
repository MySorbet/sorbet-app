'use client';

import { SidebarLinkButton } from '@/components/app-sidebar/sidebar-link-button';
import { SidebarMenuItem } from '@/components/ui/sidebar';
import { SquareUserIcon } from '@/components/ui/square-user';
import { useAuth } from '@/hooks/use-auth';

/** This component is used to display a link to the user's link-in-bio page.*/
export const LinkInBioLinkButton = () => {
  const { user } = useAuth();

  const item = {
    title: 'Link-in-bio',
    url: `/${user?.handle}`,
    icon: SquareUserIcon,
  };

  return (
    <SidebarMenuItem key={item.title}>
      <SidebarLinkButton item={item} />
    </SidebarMenuItem>
  );
};
